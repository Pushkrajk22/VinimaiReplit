import { db } from "./db";
import { users, products } from "@shared/schema";
import bcrypt from "bcrypt";

export async function seedDatabase() {
  try {
    console.log("Seeding database with sample data...");

    // Create sample users
    const hashedPassword = await bcrypt.hash("demo123", 10);

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

    // Create sample products
    const sampleProducts = [
      {
        title: "iPhone 14 Pro Max - Excellent Condition",
        description: "Like new iPhone 14 Pro Max, 256GB, Space Black. Used for only 6 months. Comes with original box, charger, and unused screen protector. No scratches or dents.",
        price: "85000",
        category: "electronics" as const,
        images: [],
        sellerId,
        status: "approved" as const,
        isAvailable: true
      },
      {
        title: "Nike Air Jordan 1 - Size 9",
        description: "Authentic Nike Air Jordan 1 in excellent condition. Size 9 US. Worn only a few times. Original box included.",
        price: "12000",
        category: "fashion" as const,
        images: [],
        sellerId,
        status: "approved" as const,
        isAvailable: true
      },
      {
        title: "MacBook Air M2 - 13 inch",
        description: "MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Perfect working condition. Ideal for students and professionals.",
        price: "95000",
        category: "electronics" as const,
        images: [],
        sellerId,
        status: "approved" as const,
        isAvailable: true
      },
      {
        title: "Wooden Study Table with Drawer",
        description: "Solid wood study table in great condition. Perfect for home office or student room. Includes one drawer for storage.",
        price: "8500",
        category: "home_garden" as const,
        images: [],
        sellerId,
        status: "approved" as const,
        isAvailable: true
      },
      {
        title: "Cricket Bat - Professional Grade",
        description: "Professional grade cricket bat, hardly used. Perfect weight and balance. Great for serious players.",
        price: "3500",
        category: "sports" as const,
        images: [],
        sellerId,
        status: "approved" as const,
        isAvailable: true
      }
    ];

    const insertedProducts = await db.insert(products).values(sampleProducts).returning();
    console.log(`Created ${insertedProducts.length} sample products`);

    console.log("Database seeded successfully!");
    return { users: insertedUsers, products: insertedProducts };

  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}