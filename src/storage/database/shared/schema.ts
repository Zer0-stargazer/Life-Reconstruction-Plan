import { pgTable, serial, varchar, timestamp, boolean, integer, text, index } from "drizzle-orm/pg-core"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// ---- User Role System ----

export const appUsers = pgTable(
  "app_users",
  {
    id: serial().primaryKey(),
    nickname: varchar("nickname", { length: 50 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 128 }).notNull(),
    avatar: varchar("avatar", { length: 20 }).default("🧑‍💻"),
    role: varchar("role", { length: 20 }).notNull().default("normal"), // normal | premium | developer
    invite_code_used: varchar("invite_code_used", { length: 50 }),
    is_active: boolean("is_active").default(true).notNull(),
    last_login_at: timestamp("last_login_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("app_users_nickname_idx").on(table.nickname),
    index("app_users_role_idx").on(table.role),
  ]
);

export const inviteCodes = pgTable(
  "invite_codes",
  {
    id: serial().primaryKey(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    label: varchar("label", { length: 100 }), // description for admin reference
    max_uses: integer("max_uses").default(1), // null = unlimited
    used_count: integer("used_count").default(0).notNull(),
    is_active: boolean("is_active").default(true).notNull(),
    created_by: varchar("created_by", { length: 50 }), // admin nickname
    expires_at: timestamp("expires_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("invite_codes_code_idx").on(table.code),
    index("invite_codes_active_idx").on(table.is_active),
  ]
);

export const accessLogs = pgTable(
  "access_logs",
  {
    id: serial().primaryKey(),
    user_id: integer("user_id").notNull().references(() => appUsers.id),
    action: varchar("action", { length: 100 }).notNull(), // e.g. "login", "redeem_code", "visit_module"
    detail: text("detail"),
    ip_address: varchar("ip_address", { length: 45 }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("access_logs_user_id_idx").on(table.user_id),
    index("access_logs_action_idx").on(table.action),
    index("access_logs_created_at_idx").on(table.created_at),
  ]
);
