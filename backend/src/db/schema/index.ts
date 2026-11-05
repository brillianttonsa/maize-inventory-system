import {
  date,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
  boolean,
  unique,
  uniqueIndex,
  foreignKey
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
 
 
// ==========================================
// 1. AUTH & ACCOUNT
// ==========================================
 
// ========================================
// users table
 
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: text('password').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});
 
// ========================================
// password reset tokens table
 
export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  used: boolean('used').default(false),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});


// ==========================================
// 2. OPERATION ROUNDS (parent of all business tables)
// ==========================================
 
// ========================================
// operation rounds table
 
export const operationRounds = pgTable(
  'operation_rounds',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    user_id: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    is_active: boolean('is_active').default(false).notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => [
    unique('operation_rounds_user_name_unique').on(table.user_id, table.name),
    unique('operation_rounds_id_user_unique')
      .on(table.id, table.user_id),
    uniqueIndex('operation_rounds_one_active_per_user')
      .on(table.user_id)
      .where(sql`${table.is_active} = true`),
  ],
);


// ==========================================
// 3. BUSINESS FLOW (buy -> mill -> sell, plus expenses)
// ==========================================
 
// ========================================
// procurement orders table
 
export const procurementOrders = pgTable('procurement_orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id') 
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  round_id: uuid('round_id')
    .notNull(),
  delivery_date: date('delivery_date').notNull(),
  supplier: varchar('supplier', { length: 255 }).notNull(),
  supplier_location: varchar('supplier_location', { length: 255 }),
  supplier_phone: varchar('supplier_phone', { length: 50 }),
  quantity_of_maize: numeric('quantity_of_maize', { precision: 12, scale: 2 }).notNull(),
  maize_purchase_cost: numeric('maize_purchase_cost', { precision: 12, scale: 2 }).notNull(),
  transport_cost: numeric('transport_cost', { precision: 12, scale: 2 }).notNull(),
  collection_labour: numeric('collection_labour', { precision: 12, scale: 2 }).default('0').notNull(),
  loading_labour: numeric('loading_labour', { precision: 12, scale: 2 }).default('0').notNull(),
  unloading_labour: numeric('unloading_labour', { precision: 12, scale: 2 }).default('0').notNull(),
  transport_tax: numeric('transport_tax', { precision: 12, scale: 2 }).default('0').notNull(),
  rural_tax: numeric('rural_tax', { precision: 12, scale: 2 }).default('0').notNull(),
  total_cost: numeric('total_cost', { precision: 12, scale: 2 }).notNull(),
  average_cost_per_kg: numeric('average_cost_per_kg', { precision: 12, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
    foreignKey({
      columns: [table.round_id, table.user_id],
      foreignColumns: [
        operationRounds.id,
        operationRounds.user_id,
      ],
      name: 'procurement_orders_round_user_fk',
    }).onDelete('restrict'),
  ],);
 
// ========================================
// production batches table
 
export const productionBatches = pgTable('production_batches', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id') 
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  round_id: uuid('round_id')
    .notNull(),
  date: date('date').notNull(),
  maize_quantity: numeric('maize_quantity', {
  precision: 12,
  scale: 2,
}).notNull(),
  flour_output: integer('flour_output').notNull(),
  flour_sacks_5kg: integer('flour_sacks_5kg').default(0).notNull(),
  flour_sacks_10kg: integer('flour_sacks_10kg').default(0).notNull(),
  flour_sacks_25kg: integer('flour_sacks_25kg').default(0).notNull(),
  bran_quantity: numeric('bran_quantity', {
  precision: 12,
  scale: 2,
}).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
},
(table) => [
    foreignKey({
      columns: [table.round_id, table.user_id],
      foreignColumns: [
        operationRounds.id,
        operationRounds.user_id,
      ],
      name: 'production_batches_round_user_fk',
    }).onDelete('restrict'),
  ],);
 
// ========================================
// sales table
 
export const sales = pgTable('sales', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id') 
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  round_id: uuid('round_id')
    .notNull(),
  date: date('date').notNull(),
  customer_name: varchar('customer_name', { length: 100 }).notNull(),
  customer_contact: varchar('customer_contact', { length: 50 }).notNull(),
  delivery_address: varchar('delivery_address', { length: 255 }).notNull(),
  product_type: varchar('product_type', { length: 20 }).notNull(),
  sack_count: integer('sack_count').notNull(),
  sack_size: integer('sack_size'),
  price_per_sack: numeric('price_per_sack', { precision: 12, scale: 2 }).notNull(),
  delivery_cost: numeric('delivery_cost', { precision: 10, scale: 2 }).notNull(),
  total_amount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.round_id, table.user_id],
    foreignColumns: [
      operationRounds.id,
      operationRounds.user_id,
    ],
    name: 'sales_round_user_fk',
  }).onDelete('restrict'),
],);
 
// ========================================
// expenses table
 
export const expenses = pgTable('expenses', {
  id: uuid('id').defaultRandom().primaryKey(),
  user_id: uuid('user_id') 
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  round_id: uuid('round_id')
    .notNull(),
  date: date('date').notNull(),
  category: text('category').notNull(),
  unit_value: numeric('unit_value'),
  unit_cost: numeric('unit_cost', { precision: 12, scale: 2 }),
  // The capacity of a sack purchase: 5 kg, 10 kg, or 25 kg.
  sack_size: integer('sack_size'),
  total_amount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.round_id, table.user_id],
    foreignColumns: [
      operationRounds.id,
      operationRounds.user_id,
    ],
    name: 'expenses_round_user_fk',
  }).onDelete('restrict'),
],);
 

// ========================================
// contacts table

export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 500 }).notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});



// ==========================================
// EXPORT TYPES
// ==========================================
export type User = typeof users.$inferSelect;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type OperationRound = typeof operationRounds.$inferSelect;
export type ProcurementOrder = typeof procurementOrders.$inferSelect;
export type ProductionBatch = typeof productionBatches.$inferSelect;
export type Sale = typeof sales.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
 
// INSERT TYPES (data going INTO database)
export type NewUser = typeof users.$inferInsert;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;
export type NewOperationRound = typeof operationRounds.$inferInsert;
export type NewProcurementOrder = typeof procurementOrders.$inferInsert;
export type NewProductionBatch = typeof productionBatches.$inferInsert;
export type NewSale = typeof sales.$inferInsert;
export type NewExpense = typeof expenses.$inferInsert;
export type NewContact = typeof contacts.$inferInsert;