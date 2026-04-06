-- Enable foreign key enforcement
PRAGMA foreign_keys = ON;

-- =====================================================
-- 1. USER & AFFINITY (Personalization Layer)
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  default_currency TEXT DEFAULT 'USD',
  default_country TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. MERCHANTS & FRANCHISE LOCATIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS merchants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  alternative_names TEXT,      
  domain TEXT,
  merchant_logo TEXT,
  industry_type TEXT,          
  country_code TEXT,
  tax_registration_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  location_address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT,
  country_code TEXT NOT NULL,
  zip TEXT NOT NULL,
  external_place_id TEXT, 
  latitude REAL,
  longitude REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS merchant_locations (
  merchant_id TEXT NOT NULL,
  location_id TEXT NOT NULL,
  PRIMARY KEY (merchant_id, location_id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
);

-- =====================================================
-- 3. TAXONOMY & PRODUCT LEARNING (The Brain)
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  taxonomy_id TEXT,          -- Shopify/External ID
  name TEXT NOT NULL,
  parent_id TEXT,
  level INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Constrain merchants to specific category branches (e.g., Decathlon -> Sports)
CREATE TABLE IF NOT EXISTS merchant_category_constraints (
  merchant_id TEXT NOT NULL,
  root_category_id TEXT NOT NULL,
  PRIMARY KEY (merchant_id, root_category_id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
  FOREIGN KEY (root_category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_id TEXT,
  default_unit TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Entity Resolution: Learns how messy receipt strings map to clean products
CREATE TABLE IF NOT EXISTS product_aliases (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  raw_receipt_name TEXT NOT NULL,
  UNIQUE(product_id, raw_receipt_name),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =====================================================
-- 4. RECEIPTS & LINE ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS receipts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  merchant_id TEXT NOT NULL,
  location_id TEXT,
  date DATETIME NOT NULL,
  subtotal_amount REAL,
  total_amount REAL NOT NULL,
  tax_amount REAL DEFAULT 0,
  items_count INTEGER,
  currency TEXT DEFAULT 'USD',
  payment_type TEXT,
  image_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS receipt_items (
  id TEXT PRIMARY KEY,
  receipt_id TEXT NOT NULL,
  product_id TEXT,
  category_id TEXT,
  raw_name TEXT,
  quantity REAL NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  unit_of_measure TEXT,
  normalized_quantity REAL,
  normalized_unit TEXT,
  discount_amount REAL DEFAULT 0,  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHECK (product_id IS NOT NULL OR category_id IS NOT NULL),
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =====================================================
-- 5. ANALYTICS & SEARCH INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_receipt_date ON receipts(date);
CREATE INDEX IF NOT EXISTS idx_item_product ON receipt_items(product_id);
CREATE INDEX IF NOT EXISTS idx_alias_lookup ON product_aliases(raw_receipt_name);
CREATE INDEX IF NOT EXISTS idx_category_hierarchy ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_user_merchant_loyalty ON user_merchants(user_id, visit_count DESC);
CREATE INDEX IF NOT EXISTS idx_merchant_constraints ON merchant_category_constraints(merchant_id);