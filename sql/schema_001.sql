-- Enable foreign key enforcement
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  default_currency TEXT DEFAULT 'USD',
  default_country TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  taxonomy_id TEXT, 
  name TEXT NOT NULL,
  parent_id TEXT,
  level INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

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

CREATE TABLE IF NOT EXISTS product_aliases (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  raw_receipt_name TEXT NOT NULL,
  UNIQUE(product_id, raw_receipt_name),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- THE SOURCE OF TRUTH: Parent to receipts
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income', 'transfer')),
  date DATETIME NOT NULL,
  amount INTEGER NOT NULL, 
  currency TEXT DEFAULT 'USD',
  payment_type TEXT,
  category_id TEXT,                   
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- THE BREAKDOWN: Child to transactions
CREATE TABLE IF NOT EXISTS receipts (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL UNIQUE, 
  merchant_id TEXT NOT NULL,
  location_id TEXT,
  subtotal_amount INTEGER, 
  tax_amount INTEGER DEFAULT 0,
  items_count INTEGER,
  image_path TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
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
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  unit_of_measure TEXT,
  normalized_quantity REAL,
  normalized_unit TEXT,
  discount_amount INTEGER DEFAULT 0, 
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHECK (product_id IS NOT NULL OR category_id IS NOT NULL),
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE VIEW IF NOT EXISTS view_legacy_receipts AS
SELECT 
    r.id,
    t.user_id,
    r.merchant_id,
    r.location_id,
    t.date,
    r.subtotal_amount,
    t.amount AS total_amount,
    r.tax_amount,
    r.items_count,
    t.currency,
    r.image_path
FROM receipts r
INNER JOIN transactions t ON r.transaction_id = t.id;

CREATE INDEX IF NOT EXISTS idx_item_product ON receipt_items(product_id);
CREATE INDEX IF NOT EXISTS idx_alias_lookup ON product_aliases(raw_receipt_name);
CREATE INDEX IF NOT EXISTS idx_category_hierarchy ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_merchant_constraints ON merchant_category_constraints(merchant_id);
CREATE INDEX IF NOT EXISTS idx_transaction_timeline ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_receipts_transaction ON receipts(transaction_id);
CREATE INDEX IF NOT EXISTS idx_receipt_items_receipt ON receipt_items(receipt_id);

CREATE TRIGGER IF NOT EXISTS trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
WHEN NEW.updated_at IS OLD.updated_at
BEGIN
    UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_merchants_updated_at
BEFORE UPDATE ON merchants
FOR EACH ROW
WHEN NEW.updated_at IS OLD.updated_at
BEGIN
    UPDATE merchants SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_locations_updated_at
BEFORE UPDATE ON locations
FOR EACH ROW
WHEN NEW.updated_at IS OLD.updated_at
BEGIN
    UPDATE locations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
WHEN NEW.updated_at IS OLD.updated_at
BEGIN
    UPDATE transactions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_receipts_updated_at
BEFORE UPDATE ON receipts
FOR EACH ROW
WHEN NEW.updated_at IS OLD.updated_at
BEGIN
    UPDATE receipts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_receipt_items_updated_at
BEFORE UPDATE ON receipt_items
FOR EACH ROW
WHEN NEW.updated_at IS OLD.updated_at
BEGIN
    UPDATE receipt_items SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;