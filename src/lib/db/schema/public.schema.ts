import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./auth.schema";

// All relations associated with the users table define here to clearly distinguish between the relation definitions and the auth definitions.
export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
}));

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  // if user is deleted, all posts of that user are deleted (cascade)
  userId: text("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [postsTable.userId],
    references: [usersTable.id],
  }),
  comments: many(commentsTable),
}));

export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  postId: integer("post_id").references(() => postsTable.id, { onDelete: "cascade" }),
});

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.id],
  }),
}));
