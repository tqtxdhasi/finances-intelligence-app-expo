-- Enable foreign key enforcement
PRAGMA foreign_keys = ON;

-- =====================================================
-- Users Table
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  default_currency TEXT DEFAULT 'USD',
  
  -- Data privacy & consent for selling aggregated data
  data_sharing_consent BOOLEAN DEFAULT 0,      -- 1 = user has agreed to share anonymized data
  consent_granted_at DATETIME,                 -- timestamp of consent
  anonymized_id TEXT UNIQUE,                   -- a non‑identifiable UUID for analytics
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Merchants Table (store chains / brands)
-- =====================================================
CREATE TABLE IF NOT EXISTS merchants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Locations Table (physical merchant/store locations)
-- =====================================================
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  name TEXT,
  address1 TEXT NOT NULL,
  address2 TEXT,
  city TEXT NOT NULL,
  province TEXT,
  province_code TEXT,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  zip TEXT NOT NULL,
  phone TEXT,
  latitude REAL,
  longitude REAL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

1
-- =====================================================
-- Categories Table (taxonomy nodes)
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  taxonomy_id TEXT NOT NULL,
  name TEXT NOT NULL,
  full_name TEXT,
  parent_id TEXT,
  level INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (taxonomy_id) REFERENCES taxonomies(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- =====================================================
-- Products Table (normalized product master)
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,                    -- normalized name, e.g., 'Coca-Cola 12oz Can'
  brand TEXT,                            -- optional brand
  category_id TEXT,                      -- primary category (from selected taxonomy)
  taxonomy_id TEXT,                      -- which taxonomy the category belongs to
  upc TEXT,                              -- Universal Product Code, if known
  unit_size TEXT,                        -- e.g., '12 oz', '500 ml'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (taxonomy_id) REFERENCES taxonomies(id) ON DELETE SET NULL
);

-- =====================================================
-- Receipts Table (with user, merchant, location links)
-- =====================================================
CREATE TABLE IF NOT EXISTS receipts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  merchant_id TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  currency TEXT DEFAULT 'USD',
  total REAL NOT NULL,
  thumbnail TEXT,
  file_type TEXT,
  location_id TEXT,
  
  -- OCR / data capture metadata
  image_path TEXT,                       -- full image path
  ocr_text TEXT,                         -- raw OCR output
  processing_status TEXT,                -- 'pending', 'processed', 'failed'
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- =====================================================
-- Receipt Items Table (with product and category links)
-- =====================================================
CREATE TABLE IF NOT EXISTS receipt_items (
  id TEXT PRIMARY KEY,
  receipt_id TEXT NOT NULL,
  name TEXT NOT NULL,                    -- original item name from receipt
  quantity REAL NOT NULL,
  unit TEXT DEFAULT 'pcs',
  price REAL NOT NULL,
  
  -- Links to normalized data
  product_id TEXT,                       -- reference to products table (if matched)
  category_id TEXT,                      -- optional override per item
  tax_id TEXT,                           -- optional tax category
  
  -- Categorization provenance (for audit/confidence)
  category_confidence REAL,              -- 0.0 - 1.0
  category_source TEXT,                  -- 'auto', 'manual', 'rule'
  category_assigned_by TEXT,             -- user_id who assigned
  category_assigned_at DATETIME,
  
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (category_assigned_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_anonymized ON users(anonymized_id);

CREATE INDEX IF NOT EXISTS idx_merchants_name ON merchants(name);

CREATE INDEX IF NOT EXISTS idx_locations_merchant ON locations(merchant_id);
CREATE INDEX IF NOT EXISTS idx_locations_country ON locations(country_code);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);

CREATE INDEX IF NOT EXISTS idx_taxonomies_name ON taxonomies(name);

CREATE INDEX IF NOT EXISTS idx_categories_taxonomy ON categories(taxonomy_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_upc ON products(upc);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

CREATE INDEX IF NOT EXISTS idx_receipts_user ON receipts(user_id);
CREATE INDEX IF NOT EXISTS idx_receipts_merchant ON receipts(merchant_id);
CREATE INDEX IF NOT EXISTS idx_receipts_date ON receipts(date);
CREATE INDEX IF NOT EXISTS idx_receipts_location ON receipts(location_id);
CREATE INDEX IF NOT EXISTS idx_receipts_status ON receipts(processing_status);

CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt ON receipt_items(receipt_id);
CREATE INDEX IF NOT EXISTS idx_receipt_items_product ON receipt_items(product_id);
CREATE INDEX IF NOT EXISTS idx_receipt_items_category ON receipt_items(category_id);

-- =====================================================
-- Triggers to Auto‑Update `updated_at` Timestamps
-- =====================================================
CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_merchants_timestamp 
AFTER UPDATE ON merchants
BEGIN
  UPDATE merchants SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_locations_timestamp 
AFTER UPDATE ON locations
BEGIN
  UPDATE locations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_taxonomies_timestamp 
AFTER UPDATE ON taxonomies
BEGIN
  UPDATE taxonomies SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_categories_timestamp 
AFTER UPDATE ON categories
BEGIN
  UPDATE categories SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_products_timestamp 
AFTER UPDATE ON products
BEGIN
  UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_receipts_timestamp 
AFTER UPDATE ON receipts
BEGIN
  UPDATE receipts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;