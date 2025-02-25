import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const viewStats = pgTable("view_stats", {
  id: serial("id").primaryKey(),
  views: integer("views").notNull().default(0),
});

export const insertViewStatsSchema = createInsertSchema(viewStats).pick({
  views: true,
});

export type InsertViewStats = z.infer<typeof insertViewStatsSchema>;
export type ViewStats = typeof viewStats.$inferSelect;
