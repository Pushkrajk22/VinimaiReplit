import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProductSchema, insertOfferSchema, insertOrderSchema, insertReturnSchema, insertNotificationSchema, insertRatingSchema, users } from "@shared/schema";
import { db } from "./db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";
import { seedDatabase } from "./seed-data";
import { authRateLimit, generalRateLimit, securityHeaders, requestLogger, validatePasswordStrength } from "./security-middleware";
import twilio from "twilio";

// Extend Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

// Ensure JWT_SECRET is set for production security
const JWT_SECRET = process.env.JWT_SECRET || "vinimai-development-secret-key";
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error("WARNING: JWT_SECRET environment variable is not set in production. Using default secret.");
  console.error("This is a security risk. Please set JWT_SECRET in your deployment secrets.");
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Initialize Twilio
let twilioClient: any = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: number }>();

// Generate 6-digit OTP
const generateOTP = (): string => {
  // Use test OTP when Twilio is not configured (development mode)
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    return "123456"; // Fixed test OTP for development
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send SMS via Twilio
const sendSMS = async (mobile: string, message: string): Promise<boolean> => {
  if (!twilioClient || !process.env.TWILIO_PHONE_NUMBER) {
    console.log(`[DEV MODE] SMS to ${mobile}: ${message}`);
    return false; // Fallback to test mode
  }

  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: mobile.startsWith('+') ? mobile : `+91${mobile}` // Add country code for India
    });
    return true;
  } catch (error) {
    console.error('Twilio SMS Error:', error);
    return false;
  }
};

// Middleware to verify JWT token
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
};

// Calculate commission fees
const calculateFees = (amount: number) => {
  const fee = amount * 0.03; // 3%
  return {
    buyerTotal: amount + fee,
    sellerReceives: amount - fee,
    platformFee: fee * 2, // 3% from both buyer and seller
    buyerFee: fee,
    sellerFee: fee
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply security middleware
  app.use(securityHeaders);
  app.use(requestLogger);
  app.use('/api/', generalRateLimit);

  // Authentication routes with rate limiting
  app.post("/api/auth/register", authRateLimit, async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Validate password strength
      const passwordValidation = validatePasswordStrength(userData.password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          message: "Password does not meet security requirements",
          errors: passwordValidation.errors
        });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByMobile(userData.mobile);
      if (existingUser) {
        return res.status(400).json({ message: "User with this mobile number already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
      
      res.json({ token, user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", authRateLimit, async (req, res) => {
    try {
      const { mobile, password } = req.body;
      
      const user = await storage.getUserByMobile(mobile);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
      
      res.json({ token, user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { mobile } = req.body;
      
      if (!mobile || mobile.length < 10) {
        return res.status(400).json({ message: "Valid mobile number is required" });
      }
      
      const otp = generateOTP();
      const message = `Your Vinimai verification code is: ${otp}. This code will expire in 10 minutes. Do not share this code with anyone.`;
      
      // Store OTP with 10-minute expiry
      otpStore.set(mobile, {
        otp,
        expires: Date.now() + (10 * 60 * 1000) // 10 minutes
      });
      
      // Try to send real SMS
      const smsSent = await sendSMS(mobile, message);
      
      if (smsSent) {
        res.json({ message: "OTP sent successfully to your mobile number" });
      } else {
        // Fallback to test mode if Twilio is not configured
        console.log(`[TEST MODE] OTP for ${mobile}: ${otp}`);
        res.json({ 
          message: "OTP sent successfully", 
          testMode: true,
          otp: process.env.NODE_ENV === 'development' ? otp : undefined 
        });
      }
    } catch (error: any) {
      console.error('Send OTP Error:', error);
      res.status(500).json({ message: "Failed to send OTP. Please try again." });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { mobile, otp } = req.body;
      
      if (!mobile || !otp) {
        return res.status(400).json({ message: "Mobile number and OTP are required" });
      }
      
      const storedOtpData = otpStore.get(mobile);
      
      if (!storedOtpData) {
        return res.status(400).json({ message: "OTP expired or not found. Please request a new OTP." });
      }
      
      if (Date.now() > storedOtpData.expires) {
        otpStore.delete(mobile);
        return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
      }
      
      if (storedOtpData.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP. Please check and try again." });
      }
      
      // OTP is valid, remove it from store
      otpStore.delete(mobile);
      
      // Update user verification status if user exists
      const user = await storage.getUserByMobile(mobile);
      if (user) {
        await storage.updateUserVerification(user.id, true);
      }

      res.json({ message: "OTP verified successfully" });
    } catch (error: any) {
      console.error('Verify OTP Error:', error);
      res.status(500).json({ message: "Failed to verify OTP. Please try again." });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { limit, offset, category, search } = req.query;
      const products = await storage.getProducts(
        Number(limit) || 20,
        Number(offset) || 0,
        category as string,
        search as string
      );
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/products", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct({
        ...productData,
        sellerId: req.user!.userId,
        status: 'pending' as const // Ensure new products start as pending
      });

      // TODO: Add notifications after fixing foreign key constraints

      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Offer routes
  app.get("/api/offers/buyer/:buyerId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const offers = await storage.getOffersByBuyer(req.params.buyerId);
      res.json(offers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/offers/seller/:sellerId", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const offers = await storage.getOffersBySeller(req.params.sellerId);
      res.json(offers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/offers/product/:productId", async (req, res) => {
    try {
      const offers = await storage.getOffersByProduct(req.params.productId);
      res.json(offers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/offers", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const offerData = insertOfferSchema.parse(req.body);
      const offer = await storage.createOffer({
        ...offerData,
        buyerId: req.user!.userId,
      });

      // Create notification for seller
      await storage.createNotification({
        userId: offer.sellerId,
        title: "New Offer Received",
        message: `You received a new offer of ₹${offer.amount} for your product`,
        type: "offer_received"
      });

      res.json(offer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/offers/:id/accept", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const offer = await storage.updateOfferStatus(req.params.id, 'accepted');
      
      // Create notification for buyer
      await storage.createNotification({
        userId: offer.buyerId,
        title: "Offer Accepted",
        message: `Your offer of ₹${offer.amount} has been accepted. Please proceed with payment.`,
        type: "offer_accepted"
      });

      res.json(offer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/offers/:id/reject", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const offer = await storage.updateOfferStatus(req.params.id, 'rejected');
      
      // Create notification for buyer
      await storage.createNotification({
        userId: offer.buyerId,
        title: "Offer Rejected",
        message: `Your offer of ₹${offer.amount} has been rejected.`,
        type: "offer_rejected"
      });

      res.json(offer);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Order routes
  app.post("/api/orders", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const fees = calculateFees(Number(orderData.finalPrice));
      
      const order = await storage.createOrder({
        ...orderData,
        buyerId: req.user!.userId,
        buyerFee: fees.buyerFee.toString(),
        sellerFee: fees.sellerFee.toString(),
        platformFee: fees.platformFee.toString(),
      });

      // Update product availability
      await storage.updateProductAvailability(order.productId, false);

      // Create notifications
      await storage.createNotification({
        userId: order.sellerId,
        title: "New Order Received",
        message: `You have a new order for ₹${order.finalPrice}`,
        type: "order_received"
      });

      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/orders/buyer/:buyerId", authenticateToken, async (req, res) => {
    try {
      const orders = await storage.getOrdersByBuyer(req.params.buyerId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/orders/seller/:sellerId", authenticateToken, async (req, res) => {
    try {
      const orders = await storage.getOrdersBySeller(req.params.sellerId);
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/orders/:id/status", authenticateToken, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      
      // Create notification for buyer
      await storage.createNotification({
        userId: order.buyerId,
        title: "Order Status Updated",
        message: `Your order status has been updated to: ${status.replace('_', ' ').toUpperCase()}`,
        type: "order_status"
      });

      res.json(order);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Return routes
  app.post("/api/returns", authenticateToken, async (req, res) => {
    try {
      const returnData = insertReturnSchema.parse(req.body);
      const returnRequest = await storage.createReturn(returnData);

      // Create notification for admin
      await storage.createNotification({
        userId: 'admin', // In real app, get admin user ID
        title: "Return Request",
        message: `New return request for order ${returnData.orderId}`,
        type: "return_request"
      });

      res.json(returnRequest);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Notification routes
  app.get("/api/notifications/:userId", authenticateToken, async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.params.userId);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/notifications/:id/read", authenticateToken, async (req, res) => {
    try {
      const notification = await storage.markNotificationAsRead(req.params.id);
      res.json(notification);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Rating routes
  app.post("/api/ratings", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const ratingData = insertRatingSchema.parse(req.body);
      const rating = await storage.createRating({
        ...ratingData,
        raterId: req.user!.userId,
      });

      res.json(rating);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin routes
  app.get("/api/admin/products/pending", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const pendingProducts = await storage.getPendingProducts();
      res.json(pendingProducts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/products/approved", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const approvedProducts = await storage.getApprovedProducts();
      res.json(approvedProducts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/products/:id/approve", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const product = await storage.updateProductStatus(req.params.id, 'approved');
      
      // Create notification for seller
      await storage.createNotification({
        userId: product.sellerId,
        title: "🎉 Product Approved!",
        message: `Great news! Your product "${product.title}" has been approved and is now live on the platform. Buyers can now discover and purchase it.`,
        type: "product_approved"
      });

      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/products/:id/reject", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { reason } = req.body;
      const product = await storage.updateProductStatus(req.params.id, 'rejected');
      
      // Create detailed notification for seller
      await storage.createNotification({
        userId: product.sellerId,
        title: "Product Needs Revision",
        message: `Your product "${product.title}" requires some changes before approval. ${reason ? `Reason: ${reason}` : 'Please review our guidelines and resubmit.'}`,
        type: "product_rejected"
      });

      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/products/:id/request-edit", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { editRequests } = req.body;
      const product = await storage.getProduct(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Create detailed notification for seller with edit requests
      await storage.createNotification({
        userId: product.sellerId,
        title: "Edit Required for Your Product",
        message: `Your product "${product.title}" needs some edits before approval. Please make the following changes: ${editRequests}`,
        type: "product_edit_request"
      });

      res.json({ message: "Edit request sent to seller" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/products/:id/delist", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { reason } = req.body;
      const product = await storage.getProduct(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Update product to delisted status
      await storage.updateProductAvailability(req.params.id, false);
      
      // Create notification for seller
      await storage.createNotification({
        userId: product.sellerId,
        title: "Product Delisted",
        message: `Your product "${product.title}" has been delisted from the platform. ${reason ? `Reason: ${reason}` : 'If you have questions, please contact support.'}`,
        type: "product_delisted"
      });

      const updatedProduct = await storage.getProduct(req.params.id);
      res.json(updatedProduct);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/products/:id", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const { reason } = req.body;
      const product = await storage.getProduct(req.params.id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Create notification for seller before deletion
      await storage.createNotification({
        userId: product.sellerId,
        title: "Product Removed",
        message: `Your product "${product.title}" has been permanently removed from the platform. ${reason ? `Reason: ${reason}` : 'If you believe this was an error, please contact support.'}`,
        type: "product_deleted"
      });

      // Delete the product
      await storage.deleteProduct(req.params.id);
      
      res.json({ message: "Product deleted successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/admin/orders", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/returns", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const returns = await storage.getAllReturns();
      res.json(returns);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/admin/returns/:id/approve", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const returnRecord = await storage.updateReturnStatus(req.params.id, 'approved');
      res.json(returnRecord);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/returns/:id/reject", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (req.user!.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const returnRecord = await storage.updateReturnStatus(req.params.id, 'rejected');
      res.json(returnRecord);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Razorpay payment routes
  app.post("/api/payments/create-order", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { amount, orderId } = req.body;
      
      // Create Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        receipt: `order_${orderId}`,
        payment_capture: true
      });

      res.json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment order: " + error.message });
    }
  });

  app.post("/api/payments/verify", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
      
      // Verify payment signature
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        // Payment is verified, update order status
        await storage.updateOrderStatus(orderId, 'confirmed');
        
        res.json({ 
          success: true, 
          message: "Payment verified successfully",
          paymentId: razorpay_payment_id
        });
      } else {
        res.status(400).json({ 
          success: false, 
          message: "Payment verification failed" 
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Error verifying payment: " + error.message });
    }
  });

  app.post("/api/payments/refund", authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { paymentId, amount, reason } = req.body;
      
      // Create refund
      const refund = await razorpay.payments.refund(paymentId, {
        amount: amount * 100, // Amount in paise
        notes: {
          reason: reason || 'Return request approved'
        }
      });

      res.json({
        success: true,
        refundId: refund.id,
        status: refund.status,
        amount: (refund.amount || 0) / 100 // Convert back to rupees
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error processing refund: " + error.message });
    }
  });

  // Seed database route (for development)
  app.post("/api/admin/seed-database", async (req, res) => {
    try {
      // Check if database is already seeded
      const existingProducts = await storage.getProducts(1);
      if (existingProducts.length > 0) {
        return res.json({ message: "Database already has data" });
      }

      const result = await seedDatabase();
      res.json({ 
        message: "Database seeded successfully",
        users: result.users.length,
        products: result.products.length
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error seeding database: " + error.message });
    }
  });

  // Create admin user route (for development/setup)
  app.post("/api/create-admin", async (req, res) => {
    try {
      // Check if admin already exists
      const existingAdmin = await storage.getUserByUsername("admin");
      if (existingAdmin) {
        return res.json({ 
          message: "Admin user already exists",
          credentials: {
            username: "admin",
            mobile: "9999999999",
            password: "admin123"
          }
        });
      }

      // Create admin user with raw database insert to handle isVerified
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const [adminUser] = await db.insert(users).values({
        username: "admin",
        mobile: "9999999999",
        email: "admin@vinimai.com",
        password: hashedPassword,
        role: "admin",
        isVerified: true
      }).returning();

      res.json({ 
        message: "Admin user created successfully",
        credentials: {
          username: "admin",
          mobile: "9999999999", 
          password: "admin123"
        },
        instructions: "You can now login with these credentials and access /admin"
      });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating admin user: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
