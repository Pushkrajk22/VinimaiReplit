import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum('user_role', ['buyer', 'seller', 'admin']);
export const productStatusEnum = pgEnum('product_status', ['pending', 'approved', 'rejected']);
export const offerStatusEnum = pgEnum('offer_status', ['pending', 'accepted', 'rejected', 'countered']);
export const orderStatusEnum = pgEnum('order_status', ['placed', 'confirmed', 'picked_up', 'out_for_delivery', 'delivered']);
export const categoryEnum = pgEnum('category', ['electronics', 'fashion', 'home_garden', 'sports', 'books', 'other']);
export const returnStatusEnum = pgEnum('return_status', ['requested', 'approved', 'rejected', 'processed']);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  mobile: text("mobile").notNull().unique(),
  email: text("email"),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default('buyer'),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: categoryEnum("category").notNull(),
  images: text("images").array().notNull().default([]),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  status: productStatusEnum("status").notNull().default('pending'),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const productModifications = pgTable("product_modifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  title: text("title"),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  category: categoryEnum("category"),
  images: text("images").array(),
  status: productStatusEnum("status").notNull().default('pending'),
  requestedAt: timestamp("requested_at").notNull().default(sql`now()`),
});

export const offers = pgTable("offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  status: offerStatusEnum("status").notNull().default('pending'),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  offerId: varchar("offer_id").references(() => offers.id),
  finalPrice: decimal("final_price", { precision: 10, scale: 2 }).notNull(),
  buyerFee: decimal("buyer_fee", { precision: 10, scale: 2 }).notNull(),
  sellerFee: decimal("seller_fee", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").notNull().default('placed'),
  deliveryAddress: text("delivery_address").notNull(),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const returns = pgTable("returns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  reason: text("reason").notNull(),
  returnType: text("return_type").notNull(), // 'on_spot' or 'within_days'
  status: returnStatusEnum("status").notNull().default('requested'),
  requestedAt: timestamp("requested_at").notNull().default(sql`now()`),
  processedAt: timestamp("processed_at"),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull().references(() => orders.id),
  raterId: varchar("rater_id").notNull().references(() => users.id),
  ratedId: varchar("rated_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  buyerOffers: many(offers, { relationName: "buyer_offers" }),
  sellerOffers: many(offers, { relationName: "seller_offers" }),
  buyerOrders: many(orders, { relationName: "buyer_orders" }),
  sellerOrders: many(orders, { relationName: "seller_orders" }),
  notifications: many(notifications),
  givenRatings: many(ratings, { relationName: "given_ratings" }),
  receivedRatings: many(ratings, { relationName: "received_ratings" }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
  offers: many(offers),
  orders: many(orders),
  modifications: many(productModifications),
}));

export const productModificationsRelations = relations(productModifications, ({ one }) => ({
  product: one(products, {
    fields: [productModifications.productId],
    references: [products.id],
  }),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  product: one(products, {
    fields: [offers.productId],
    references: [products.id],
  }),
  buyer: one(users, {
    fields: [offers.buyerId],
    references: [users.id],
    relationName: "buyer_offers",
  }),
  seller: one(users, {
    fields: [offers.sellerId],
    references: [users.id],
    relationName: "seller_offers",
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  buyer: one(users, {
    fields: [orders.buyerId],
    references: [users.id],
    relationName: "buyer_orders",
  }),
  seller: one(users, {
    fields: [orders.sellerId],
    references: [users.id],
    relationName: "seller_orders",
  }),
  product: one(products, {
    fields: [orders.productId],
    references: [products.id],
  }),
  offer: one(offers, {
    fields: [orders.offerId],
    references: [offers.id],
  }),
  returns: many(returns),
  ratings: many(ratings),
}));

export const returnsRelations = relations(returns, ({ one }) => ({
  order: one(orders, {
    fields: [returns.orderId],
    references: [orders.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  order: one(orders, {
    fields: [ratings.orderId],
    references: [orders.id],
  }),
  rater: one(users, {
    fields: [ratings.raterId],
    references: [users.id],
    relationName: "given_ratings",
  }),
  rated: one(users, {
    fields: [ratings.ratedId],
    references: [users.id],
    relationName: "received_ratings",
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isVerified: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  sellerId: true,
});

export const insertOfferSchema = createInsertSchema(offers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReturnSchema = createInsertSchema(returns).omit({
  id: true,
  requestedAt: true,
  processedAt: true,
  status: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  isRead: true,
});

export const insertRatingSchema = createInsertSchema(ratings).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type Offer = typeof offers.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type InsertReturn = z.infer<typeof insertReturnSchema>;
export type Return = typeof returns.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratings.$inferSelect;
export type ProductModification = typeof productModifications.$inferSelect;
