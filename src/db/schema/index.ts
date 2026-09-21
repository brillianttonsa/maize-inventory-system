import {
  bigint,
  date,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  uuid,
  boolean,
  unique
} from 'drizzle-orm/pg-core';

// ==========================================
// ENUMS FOR CHOSEN CONFIGURATIONS
// ==========================================
// ==========================================
// EXISTENT SYSTEM TABLES
// ==========================================

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: text('password').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const productionBatches = pgTable('production_batches', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id') // Changed to uuid to fix relationship type mismatch
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  maize_quantity: integer('maize_quantity').notNull(),
  flour_output: integer('flour_output').notNull(),
  flour_sacks_5kg: integer('flour_sacks_5kg').default(0).notNull(),
  flour_sacks_10kg: integer('flour_sacks_10kg').default(0).notNull(),
  flour_sacks_25kg: integer('flour_sacks_25kg').default(0).notNull(),
  bran_debe_quantity: numeric('bran_debe_quantity', { precision: 12, scale: 2 }),
  bran_unit: varchar('bran_unit', { length: 20 }),
  date: date('date').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const procurementOrders = pgTable('procurement_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id') // Changed to uuid to fix relationship type mismatch
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  supplier: varchar('supplier', { length: 255 }).notNull(),
  quantity: numeric('quantity', { precision: 12, scale: 2 }).notNull(),
  price_per_kg: numeric('price_per_kg', { precision: 12, scale: 2 }).notNull(),
  transport_cost: numeric('transport_cost', { precision: 12, scale: 2 }).notNull(),
  total_cost: numeric('total_cost', { precision: 12, scale: 2 }).notNull(),
  delivery_date: date('delivery_date').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const sales = pgTable('sales', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id') // Changed to uuid to fix relationship type mismatch
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  customer_name: varchar('customer_name', { length: 100 }).notNull(),
  customer_contact: varchar('customer_contact', { length: 50 }).notNull(),
  product_type: varchar('product_type', { length: 20 }).notNull(),
  quantity: numeric('quantity', { precision: 10, scale: 2 }).notNull(),
  sack_count: integer('sack_count'),
  sack_size: integer('sack_size'),
  bran_debe_quantity: numeric('bran_debe_quantity', { precision: 12, scale: 2 }),
  bran_unit_count: numeric('bran_unit_count', { precision: 12, scale: 2 }),
  bran_unit: varchar('bran_unit', { length: 20 }),
  price_per_kg: numeric('price_per_kg', { precision: 10, scale: 2 }).notNull(),
  delivery_cost: numeric('delivery_cost', { precision: 10, scale: 2 }).notNull(),
  delivery_address: varchar('delivery_address', { length: 255 }).notNull(),
  payment_method: varchar('payment_method', { length: 30 }).notNull(),
  total_amount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  date: date('date').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id') // Changed to uuid to fix relationship type mismatch
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  category: text('category').notNull(),
  unit_value: numeric('unit_value'),
  unit_cost: numeric('unit_cost', { precision: 12, scale: 2 }),
  // The capacity of a sack purchase: 5 kg, 10 kg, or 25 kg.
  sack_size: integer('sack_size'),
  amount: bigint('amount', { mode: 'number' }).notNull(),
  paid_by: text('paid_by'),
  method: text('method'),
  notes: text('notes'),
  description: text('description'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id') 
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  used: boolean('used').default(false),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});


// ==========================================
// EXPORT TYPES
// ==========================================
export type User = typeof users.$inferSelect;
export type ProductionBatch = typeof productionBatches.$inferSelect;
export type ProcurementOrder = typeof procurementOrders.$inferSelect;
export type Sale = typeof sales.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type Contact = typeof contacts.$inferSelect;

// INSERT TYPES (data going INTO database)
export type NewUser = typeof users.$inferInsert;
export type NewProductionBatch = typeof productionBatches.$inferInsert;
export type NewProcurementOrder = typeof procurementOrders.$inferInsert;
export type NewSale = typeof sales.$inferInsert;
export type NewExpense = typeof expenses.$inferInsert;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;
export type NewContact = typeof contacts.$inferInsert;
