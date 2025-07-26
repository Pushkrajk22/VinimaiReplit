import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertProductSchema, insertOfferSchema, insertOrderSchema, insertReturnSchema, insertNotificationSchema, insertRatingSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Razorpay from "razorpay";
import crypto from "crypto";
import { seedDatabase } from "./seed-data";
import { authRateLimit, generalRateLimit, securityHeaders, requestLogger, validatePasswordStrength } from "./security-middleware";

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
  throw new Error("JWT_SECRET environment variable must be set in production");
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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
      // In a real app, send OTP via SMS service like Twilio
      // For now, we'll just return success
      res.json({ message: "OTP sent successfully", otp: "123456" }); // Remove OTP in production
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { mobile, otp } = req.body;
      
      // In a real app, verify OTP with SMS service
      if (otp !== "123456") {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      const user = await storage.getUserByMobile(mobile);
      if (user) {
        await storage.updateUserVerification(user.id, true);
      }

      res.json({ message: "OTP verified successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
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
      });

      // Create notification for admin about new product
      await storage.createNotification({
        userId: 'admin', // In real app, get admin user ID
        title: "New Product Submission",
        message: `New product "${product.title}" submitted for approval`,
        type: "product_approval"
      });

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
      
      // In a real app, implement getPendingProducts in storage
      res.json([]);
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
        title: "Product Approved",
        message: `Your product "${product.title}" has been approved and is now live`,
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

      const product = await storage.updateProductStatus(req.params.id, 'rejected');
      
      // Create notification for seller
      await storage.createNotification({
        userId: product.sellerId,
        title: "Product Rejected",
        message: `Your product "${product.title}" has been rejected. Please review and resubmit.`,
        type: "product_rejected"
      });

      res.json(product);
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

  const httpServer = createServer(app);
  return httpServer;
}
