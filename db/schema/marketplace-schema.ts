import {
  pgTable,
  text,
  timestamp,
  decimal,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { recipe } from "./recipe-schema";

export const marketplaceProduct = pgTable(
  "marketplace_product",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipe.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    seller: text("seller").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    rating: decimal("rating", { precision: 3, scale: 1 }).notNull(),
    imageUrl: text("image_url"),
    category: text("category").notNull().default("Other"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("product_category_idx").on(table.category),
    index("product_recipeId_idx").on(table.recipeId),
  ]
);
