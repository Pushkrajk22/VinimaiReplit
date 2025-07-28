import { 
  users, products, offers, orders, returns, notifications, ratings, productModifications,
  type User, type InsertUser, type Product, type InsertProduct, 
  type Offer, type InsertOffer, type Order, type InsertOrder,
  type Return, type InsertReturn, type Notification, type InsertNotification,
  type Rating, type InsertRating, type ProductModification
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, like, or } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByMobile(mobile: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserVerification(id: string, isVerified: boolean): Promise<User>;

  // Product management
  getProduct(id: string): Promise<Product | undefined>;
  getProducts(limit?: number, offset?: number, category?: string, search?: string): Promise<Product[]>;
  getProductsBySeller(sellerId: string): Promise<Product[]>;
  getPendingProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Product>;
  updateProductAvailability(id: string, isAvailable: boolean): Promise<Product>;

  // Product modification requests
  getProductModifications(): Promise<ProductModification[]>;
  createProductModification(modification: any): Promise<ProductModification>;
  updateProductModificationStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<ProductModification>;

  // Offer management
  getOffer(id: string): Promise<Offer | undefined>;
  getOffersByProduct(productId: string): Promise<Offer[]>;
  getOffersByBuyer(buyerId: string): Promise<Offer[]>;
  getOffersBySeller(sellerId: string): Promise<Offer[]>;
  createOffer(offer: InsertOffer): Promise<Offer>;
  updateOfferStatus(id: string, status: 'pending' | 'accepted' | 'rejected' | 'countered'): Promise<Offer>;

  // Order management
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByBuyer(buyerId: string): Promise<Order[]>;
  getOrdersBySeller(sellerId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: 'placed' | 'confirmed' | 'picked_up' | 'out_for_delivery' | 'delivered'): Promise<Order>;

  // Return management
  getReturnsByOrder(orderId: string): Promise<Return[]>;
  createReturn(returnRequest: InsertReturn): Promise<Return>;
  updateReturnStatus(id: string, status: 'requested' | 'approved' | 'rejected' | 'processed'): Promise<Return>;

  // Notification management
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification>;

  // Rating management
  getRatingsByOrder(orderId: string): Promise<Rating[]>;
  createRating(rating: InsertRating): Promise<Rating>;
}

export class DatabaseStorage implements IStorage {
  // User management
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByMobile(mobile: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.mobile, mobile));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserVerification(id: string, isVerified: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isVerified })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Product management
  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProducts(limit = 20, offset = 0, category?: string, search?: string): Promise<Product[]> {
    let conditions = [eq(products.status, 'approved')];

    if (category) {
      conditions.push(eq(products.category, category as any));
    }

    if (search) {
      conditions.push(
        or(
          like(products.title, `%${search}%`),
          like(products.description, `%${search}%`)
        )!
      );
    }

    return await db
      .select()
      .from(products)
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.sellerId, sellerId));
  }

  async getPendingProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.status, 'pending')).orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProductStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ status, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async updateProductAvailability(id: string, isAvailable: boolean): Promise<Product> {
    const [product] = await db
      .update(products)
      .set({ isAvailable, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  // Product modification requests
  async getProductModifications(): Promise<ProductModification[]> {
    return await db.select().from(productModifications).orderBy(desc(productModifications.requestedAt));
  }

  async createProductModification(modification: any): Promise<ProductModification> {
    const [newModification] = await db
      .insert(productModifications)
      .values(modification)
      .returning();
    return newModification;
  }

  async updateProductModificationStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<ProductModification> {
    const [modification] = await db
      .update(productModifications)
      .set({ status })
      .where(eq(productModifications.id, id))
      .returning();
    return modification;
  }

  // Offer management
  async getOffer(id: string): Promise<Offer | undefined> {
    const [offer] = await db.select().from(offers).where(eq(offers.id, id));
    return offer || undefined;
  }

  async getOffersByProduct(productId: string): Promise<Offer[]> {
    return await db.select().from(offers).where(eq(offers.productId, productId)).orderBy(desc(offers.createdAt));
  }

  async getOffersByBuyer(buyerId: string): Promise<Offer[]> {
    return await db.select().from(offers).where(eq(offers.buyerId, buyerId)).orderBy(desc(offers.createdAt));
  }

  async getOffersBySeller(sellerId: string): Promise<Offer[]> {
    return await db.select().from(offers).where(eq(offers.sellerId, sellerId)).orderBy(desc(offers.createdAt));
  }

  async createOffer(offer: InsertOffer): Promise<Offer> {
    const [newOffer] = await db
      .insert(offers)
      .values(offer)
      .returning();
    return newOffer;
  }

  async updateOfferStatus(id: string, status: 'pending' | 'accepted' | 'rejected' | 'countered'): Promise<Offer> {
    const [offer] = await db
      .update(offers)
      .set({ status, updatedAt: new Date() })
      .where(eq(offers.id, id))
      .returning();
    return offer;
  }

  // Order management
  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.buyerId, buyerId)).orderBy(desc(orders.createdAt));
  }

  async getOrdersBySeller(sellerId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.sellerId, sellerId)).orderBy(desc(orders.createdAt));
  }

  async getAllOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }

  async updateOrderStatus(id: string, status: 'placed' | 'confirmed' | 'picked_up' | 'out_for_delivery' | 'delivered'): Promise<Order> {
    const [order] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return order;
  }

  // Return management
  async getReturnsByOrder(orderId: string): Promise<Return[]> {
    return await db.select().from(returns).where(eq(returns.orderId, orderId));
  }

  async createReturn(returnRequest: InsertReturn): Promise<Return> {
    const [newReturn] = await db
      .insert(returns)
      .values(returnRequest)
      .returning();
    return newReturn;
  }

  async updateReturnStatus(id: string, status: 'requested' | 'approved' | 'rejected' | 'processed'): Promise<Return> {
    const [returnRecord] = await db
      .update(returns)
      .set({ status, processedAt: new Date() })
      .where(eq(returns.id, id))
      .returning();
    return returnRecord;
  }

  // Notification management
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(notification)
      .returning();
    return newNotification;
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    const [notification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  // Rating management
  async getRatingsByOrder(orderId: string): Promise<Rating[]> {
    return await db.select().from(ratings).where(eq(ratings.orderId, orderId));
  }

  async createRating(rating: InsertRating): Promise<Rating> {
    const [newRating] = await db
      .insert(ratings)
      .values(rating)
      .returning();
    return newRating;
  }
}

export const storage = new DatabaseStorage();
