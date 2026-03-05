import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  balance: integer("balance").default(0).notNull(),
  realBalance: integer("real_balance").default(0).notNull(),
  clanId: integer("clan_id"),
});

export const clans = pgTable("clans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  leader: text("leader").notNull(),
  coLeaders: text("co_leaders"),
  membersCount: integer("members_count").notNull().default(1),
  level: integer("level").notNull().default(1),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertClanSchema = createInsertSchema(clans).omit({ id: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Clan = typeof clans.$inferSelect;
export type InsertClan = z.infer<typeof insertClanSchema>;
