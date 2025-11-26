import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const bins = pgTable("bins", {
    id: text("id").primaryKey(),
    content: text("content").notNull(),
    language: text("language").notNull(),
    isPrivate: boolean("is_private").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
