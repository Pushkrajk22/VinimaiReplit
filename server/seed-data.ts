import { db } from "./db";
import { users, products, orders, returns, offers } from "@shared/schema";
import bcrypt from "bcrypt";

export async function seedDatabase() {
  try {
    console.log("Seeding database with sample data...");

    // Create sample users
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const sampleUsers = [
      {
        username: "admin",
        mobile: "9999999999",
        email: "admin@vinimai.com",
        password: hashedPassword,
        role: "admin" as const,
        isVerified: true
      },
      {
        username: "seller1",
        mobile: "9876543210",
        email: "seller1@example.com",
        password: hashedPassword,
        role: "seller" as const,
        isVerified: true
      },
      {
        username: "buyer1",
        mobile: "9876543211",
        email: "buyer1@example.com",
        password: hashedPassword,
        role: "buyer" as const,
        isVerified: true
      }
    ];

    // Insert users and get their IDs
    const insertedUsers = await db.insert(users).values(sampleUsers).returning();
    console.log(`Created ${insertedUsers.length} sample users`);

    const sellerId = insertedUsers.find(u => u.username === "seller1")?.id;
    if (!sellerId) throw new Error("Seller not found");

    // Create sample products with images
    const sampleProducts = [
      {
        title: "iPhone 14 Pro Max - Excellent Condition",
        description: "Like new iPhone 14 Pro Max, 256GB, Space Black. Used for only 6 months. Comes with original box, charger, and unused screen protector. No scratches or dents.",
        price: "85000",
        category: "electronics" as const,
        images: ["/attached_assets/IMG-20250628-WA0001_1753533870884.jpg"],
        sellerId,
        status: "approved" as const,
        isAvailable: true
      },
      {
        title: "Nike Air Jordan 1 - Size 9",
        description: "Authentic Nike Air Jordan 1 in excellent condition. Size 9 US. Worn only a few times. Original box included.",
        price: "12000",
        category: "fashion" as const,
        images: ["/attached_assets/IMG-20250628-WA0001_1753533870884.jpg"],
        sellerId,
        status: "approved" as const,
        isAvailable: true
      },
      {
        title: "MacBook Air M2 - 13 inch",
        description: "MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Perfect working condition. Ideal for students and professionals.",
        price: "95000",
        category: "electronics" as const,
        images: ["/attached_assets/IMG-20250628-WA0001_1753533870884.jpg"],
        sellerId,
        status: "approved" as const,
        isAvailable: true
      },
      {
        title: "Wooden Study Table with Drawer",
        description: "Solid wood study table in great condition. Perfect for home office or student room. Includes one drawer for storage.",
        price: "8500",
        category: "home_garden" as const,
        images: ["/attached_assets/IMG-20250628-WA0001_1753533870884.jpg"],
        sellerId,
        status: "approved" as const,
        isAvailable: true
      },
      {
        title: "Cricket Bat - Professional Grade",
        description: "Professional grade cricket bat, hardly used. Perfect weight and balance. Great for serious players.",
        price: "3500",
        category: "sports" as const,
        images: ["/attached_assets/IMG-20250628-WA0001_1753533870884.jpg"],
        sellerId,
        status: "approved" as const,
        isAvailable: true
      }
    ];

    // Create pending products for admin approval with diverse media
    const pendingProducts = [
      {
        title: "Samsung Galaxy S24 Ultra - Brand New",
        description: "Brand new Samsung Galaxy S24 Ultra, 512GB, Titanium Black. Sealed box with warranty. Latest flagship with S Pen included.",
        price: "125000",
        category: "electronics" as const,
        images: ["/attached_assets/Screenshot_20250728_130733_Replit_1753688281606.jpg", "/attached_assets/image_1753686604453.png"],
        sellerId,
        status: "pending" as const,
        isAvailable: true
      },
      {
        title: "Designer Leather Handbag - Luxury",
        description: "Authentic designer leather handbag in perfect condition. Used only twice for special occasions. Comes with dust bag and authenticity certificate.",
        price: "45000",
        category: "fashion" as const,
        images: ["/attached_assets/Screenshot_20250728_151656_Replit_1753696032334.jpg", "/attached_assets/Screenshot_20250728_194216_Replit_1753711950125.jpg"],
        sellerId,
        status: "pending" as const,
        isAvailable: true
      },
      {
        title: "Gaming Laptop - RTX 4080 Setup",
        description: "High-performance gaming laptop with RTX 4080, Intel i9, 32GB RAM, 1TB SSD. Perfect for gaming and content creation. Barely used.",
        price: "180000",
        category: "electronics" as const,
        images: ["/attached_assets/Screenshot_20250728_214127_Replit_1753719097573.jpg", "/attached_assets/Screenshot_20250728_214600_Replit_1753719372492.jpg"],
        sellerId,
        status: "pending" as const,
        isAvailable: true
      },
      {
        title: "Vintage Dining Set - 6 Chairs",
        description: "Beautiful vintage wooden dining set with 6 matching chairs. Solid teak wood construction. Perfect for classic home decor enthusiasts.",
        price: "35000",
        category: "home_garden" as const,
        images: ["/attached_assets/Screenshot_20250728_215316_Replit_1753719854299.jpg"],
        sellerId,
        status: "pending" as const,
        isAvailable: true
      },
      {
        title: "Professional Tennis Racket Set",
        description: "Professional grade tennis racket with carrying case and extra strings. Used by intermediate level player. Wilson Pro Staff series.",
        price: "15000",
        category: "sports" as const,
        images: ["/attached_assets/Screenshot_20250728_215649_Replit_1753720020699.jpg", "/attached_assets/IMG-20250628-WA0001_1753533870884.jpg"],
        sellerId,
        status: "pending" as const,
        isAvailable: true
      },
      {
        title: "Medical Textbook Collection - MBBS",
        description: "Complete set of MBBS medical textbooks including Harrison's, Robbins, Netter's Atlas. All books in excellent condition with minimal highlighting.",
        price: "25000",
        category: "books" as const,
        images: ["/attached_assets/image_1753686604453.png"],
        sellerId,
        status: "pending" as const,
        isAvailable: true
      }
    ];

    // Insert approved products first
    const insertedProducts = await db.insert(products).values(sampleProducts).returning();
    console.log(`Created ${insertedProducts.length} approved products`);

    // Insert pending products for admin approval
    const insertedPendingProducts = await db.insert(products).values(pendingProducts).returning();
    console.log(`Created ${insertedPendingProducts.length} pending products`);

    // Get buyer and seller IDs
    const buyerId = insertedUsers.find(u => u.username === "buyer1")?.id;
    if (!buyerId) throw new Error("Buyer not found");

    // Create sample orders
    const sampleOrders = [
      {
        id: "order-1",
        productId: insertedProducts[0].id,
        buyerId,
        sellerId,
        originalPrice: "85000",
        finalPrice: "82000",
        platformFee: "2460", // 3% from both buyer and seller
        status: "delivered" as const,
        shippingAddress: "123 Main Street, Mumbai, Maharashtra 400001",
        paymentId: "pay_sample1"
      },
      {
        id: "order-2", 
        productId: insertedProducts[1].id,
        buyerId,
        sellerId,
        originalPrice: "12000",
        finalPrice: "11500",
        platformFee: "690",
        status: "out_for_delivery" as const,
        shippingAddress: "456 Park Avenue, Delhi, Delhi 110001",
        paymentId: "pay_sample2"
      },
      {
        id: "order-3",
        productId: insertedProducts[2].id,
        buyerId,
        sellerId,
        originalPrice: "95000",
        finalPrice: "92000",
        platformFee: "2760",
        status: "confirmed" as const,
        shippingAddress: "789 Garden Road, Bangalore, Karnataka 560001",
        paymentId: "pay_sample3"
      },
      {
        id: "order-4",
        productId: insertedProducts[3].id,
        buyerId,
        sellerId,
        originalPrice: "8500",
        finalPrice: "8000",
        platformFee: "480",
        status: "delivered" as const,
        shippingAddress: "321 Lake View, Pune, Maharashtra 411001",
        paymentId: "pay_sample4"
      },
      {
        id: "order-5",
        productId: insertedProducts[4].id,
        buyerId,
        sellerId,
        originalPrice: "3500",
        finalPrice: "3200",
        platformFee: "192",
        status: "picked_up" as const,
        shippingAddress: "654 Hill Station, Chennai, Tamil Nadu 600001",
        paymentId: "pay_sample5"
      }
    ];

    const insertedOrders = await db.insert(orders).values(sampleOrders).returning();
    console.log(`Created ${insertedOrders.length} sample orders`);

    // Create sample returns
    const sampleReturns = [
      {
        orderId: "order-1",
        reason: "Product not as described",
        description: "The phone has some scratches that were not mentioned in the listing",
        status: "approved" as const,
        refundAmount: "82000"
      },
      {
        orderId: "order-4",
        reason: "Damaged during shipping",
        description: "Table arrived with a broken leg",
        status: "requested" as const,
        refundAmount: "8000"
      }
    ];

    const insertedReturns = await db.insert(returns).values(sampleReturns).returning();
    console.log(`Created ${insertedReturns.length} sample returns`);

    console.log("Database seeded successfully!");
    return { users: insertedUsers, products: insertedProducts, orders: insertedOrders, returns: insertedReturns };

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}