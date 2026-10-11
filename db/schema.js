import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  index,
  check,
} from "drizzle-orm/sqlite-core";
export const entries = sqliteTable(
  "portfolio_entries",
  {
    kind: text("kind").notNull(),
    id: text("id").notNull(),
    payload: text("payload").notNull(),
    status: text("status").notNull(),
    revision: integer("revision").notNull().default(1),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.kind, t.id] }),
    index("portfolio_published").on(t.status, t.kind),
    check("valid_kind", sql`${t.kind} IN ('projects','labs','badges','blog')`),
    check("valid_status", sql`${t.status} IN ('draft','published')`),
  ],
);
export const settings = sqliteTable("portfolio_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});
export const sessions = sqliteTable("admin_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  csrf: text("csrf").notNull(),
  expiresAt: integer("expires_at").notNull(),
});
export const attempts = sqliteTable("admin_login_attempts", {
  key: text("key").primaryKey(),
  attempts: integer("attempts").notNull(),
  startedAt: integer("started_at").notNull(),
});
export const audit = sqliteTable("admin_audit", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  kind: text("kind").notNull(),
  entryId: text("entry_id").notNull(),
  createdAt: integer("created_at").notNull(),
});
