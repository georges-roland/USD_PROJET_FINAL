-- =========================================================================
-- BASE DE DONNÉES DU PROJET USD
-- =========================================================================
-- Ce script SQL initialise la base de données PostgreSQL pour l'application USD.
-- Il définit les tables, les clés étrangères, les index de performance et injecte
-- des données de démonstration (utilisateurs, produits, traductions).

-- Désactiver temporairement les contraintes pour faciliter la réinitialisation (si besoin)
-- DROP TABLE IF EXISTS support_messages CASCADE;
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS product_translations CASCADE;
-- DROP TABLE IF EXISTS products CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- =========================================================================
-- 1. TABLE DES UTILISATEURS (users)
-- =========================================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour accélérer les recherches d'utilisateurs lors de la connexion
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- =========================================================================
-- 2. TABLE DES PRODUITS (products)
-- =========================================================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price INTEGER NOT NULL, -- Prix stocké en centimes (ex: 1500 pour 15.00)
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    image_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    currency_code VARCHAR(10) NOT NULL DEFAULT 'USD',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index sur SKU pour les recherches rapides de stocks et de fiches produits
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- =========================================================================
-- 3. TABLE DES TRADUCTIONS DE PRODUITS (product_translations)
-- =========================================================================
-- Gère l'internationalisation (i18n) en séparant les champs textuels du produit
CREATE TABLE IF NOT EXISTS product_translations (
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    language_code VARCHAR(5) NOT NULL, -- 'fr', 'en', etc.
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) NOT NULL,
    PRIMARY KEY (product_id, language_code)
);

-- Index pour accélérer le filtrage par langue dans le catalogue
CREATE INDEX IF NOT EXISTS idx_product_translations_lang ON product_translations(language_code);

-- =========================================================================
-- 4. TABLE DES COMMANDES (orders)
-- =========================================================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount INTEGER NOT NULL, -- Total en centimes
    currency_code VARCHAR(10) NOT NULL DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'CANCELLED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour l'historique d'achat d'un utilisateur et les jointures
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);

-- =========================================================================
-- 5. TABLE DES LIGNES DE COMMANDE (order_items)
-- =========================================================================
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL -- Prix à l'unité en centimes au moment de l'achat
);

-- Index pour récupérer rapidement les articles associés à une commande
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- =========================================================================
-- 6. TABLE DES MESSAGES DE SUPPORT (support_messages)
-- =========================================================================
CREATE TABLE IF NOT EXISTS support_messages (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    sender VARCHAR(50) NOT NULL DEFAULT 'client', -- 'client' ou 'admin'
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index sur l'email pour regrouper ou chercher les messages par client
CREATE INDEX IF NOT EXISTS idx_support_messages_email ON support_messages(email);

-- =========================================================================
-- 7. INJECTION DES DONNÉES DE DÉMONSTRATION (Seeds)
-- =========================================================================

-- Administrateurs système par défaut (Mot de passe démo haché avec bcrypt)
INSERT INTO users (email, password_hash, first_name, last_name)
VALUES 
('janesgiges23@gmail.com', '$2b$10$tMh4Hk.Vn5J5gZ8b3L6vKecB8eP1ZfD/n5NfC1aP7y3M8o9W9h/iG', 'Jane', 'Sgiges'),
('epolegeorgesroland@gmail.com', '$2b$10$tMh4Hk.Vn5J5gZ8b3L6vKecB8eP1ZfD/n5NfC1aP7y3M8o9W9h/iG', 'Georges Roland', 'Epole')
ON CONFLICT (email) DO NOTHING;

-- Produits de démonstration initiaux
INSERT INTO products (id, sku, price, stock_quantity, image_url, is_active, currency_code)
VALUES
(1, 'PROD-MACBOOK-AIR', 129900, 15, '/uploads/macbook-air.jpg', TRUE, 'USD'),
(2, 'PROD-IPHONE-15', 99900, 30, '/uploads/iphone-15.jpg', TRUE, 'USD'),
(3, 'PROD-AIRPODS-PRO', 24900, 50, '/uploads/airpods-pro.jpg', TRUE, 'USD'),
(4, 'PROD-APPLE-WATCH', 39900, 25, '/uploads/apple-watch.jpg', TRUE, 'USD')
ON CONFLICT (id) DO NOTHING;

-- Ajustement de la séquence auto-incrémentée pour les futurs inserts
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- Traductions associées (Français & Anglais)
INSERT INTO product_translations (product_id, language_code, name, description, slug)
VALUES
(1, 'fr', 'MacBook Air M3', 'Ordinateur portable ultra-fin et performant avec puce Apple M3.', 'macbook-air-m3'),
(1, 'en', 'MacBook Air M3', 'Ultra-thin and powerful laptop with Apple M3 chip.', 'macbook-air-m3'),
(2, 'fr', 'iPhone 15 Pro', 'Le tout nouvel iPhone avec design en titane et puce A17 Pro.', 'iphone-15-pro'),
(2, 'en', 'iPhone 15 Pro', 'The all-new iPhone featuring titanium design and A17 Pro chip.', 'iphone-15-pro'),
(3, 'fr', 'AirPods Pro 2', 'Écouteurs sans fil avec réduction active du bruit de niveau supérieur.', 'airpods-pro-2'),
(3, 'en', 'AirPods Pro 2', 'Wireless earbuds featuring next-level Active Noise Cancellation.', 'airpods-pro-2'),
(4, 'fr', 'Apple Watch Series 9', 'Montre connectée avec capteurs de santé avancés et geste double toucher.', 'apple-watch-series-9'),
(4, 'en', 'Apple Watch Series 9', 'Smartwatch featuring advanced health sensors and double-tap gesture.', 'apple-watch-series-9')
ON CONFLICT (product_id, language_code) DO NOTHING;
