import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { marketplaceProduct } from "./marketplace-schema";

export const purchase = pgTable("purchase", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => marketplaceProduct.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const purchaseRelations = relations(purchase, ({ one }) => ({
  user: one(user, {
    fields: [purchase.userId],
    references: [user.id],
  }),
  product: one(marketplaceProduct, {
    fields: [purchase.productId],
    references: [marketplaceProduct.id],
  }),
}));
