import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  integer,
  json,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const recipe = pgTable(
  "recipe",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: text("category").notNull(),
    difficulty: text("difficulty").notNull(),
    prepTime: text("prep_time").notNull(),
    cookTime: text("cook_time").notNull(),
    servings: text("servings").notNull(),
    imageUrl: text("image_url"),
    tags: json("tags").$type<string[]>().default([]).notNull(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("recipe_userId_idx").on(table.userId)]
);

export const recipeIngredient = pgTable(
  "recipe_ingredient",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipe.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    amount: text("amount").notNull(),
    unit: text("unit").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("ingredient_recipeId_idx").on(table.recipeId)]
);

export const recipeStep = pgTable(
  "recipe_step",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    recipeId: uuid("recipe_id")
      .notNull()
      .references(() => recipe.id, { onDelete: "cascade" }),
    instruction: text("instruction").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("step_recipeId_idx").on(table.recipeId)]
);

// Relations
export const recipeRelations = relations(recipe, ({ one, many }) => ({
  user: one(user, {
    fields: [recipe.userId],
    references: [user.id],
  }),
  ingredients: many(recipeIngredient),
  steps: many(recipeStep),
}));

export const recipeIngredientRelations = relations(
  recipeIngredient,
  ({ one }) => ({
    recipe: one(recipe, {
      fields: [recipeIngredient.recipeId],
      references: [recipe.id],
    }),
  })
);

export const recipeStepRelations = relations(recipeStep, ({ one }) => ({
  recipe: one(recipe, {
    fields: [recipeStep.recipeId],
    references: [recipe.id],
  }),
}));
