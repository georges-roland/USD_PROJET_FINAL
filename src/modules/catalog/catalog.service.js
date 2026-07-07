import pool from '../../config/db.js';

export const getProducts = async (lang, search = '') => {
  let query = `
    SELECT p.id, p.sku, p.price, p.stock_quantity, p.image_url,
           t.name, t.description, t.slug
    FROM products p
    JOIN product_translations t ON p.id = t.product_id
    WHERE t.language_code = $1
  `;
  const params = [lang];
  
  if (search) {
    query += ` AND t.name ILIKE $2`;
    params.push(`%${search}%`);
  }
  
  const result = await pool.query(query, params);
  return result.rows;
};

export const createProduct = async (productData, imageUrl) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cleanPrice = parseInt(productData.price, 10);
    const cleanStock = parseInt(productData.stock_quantity, 10);
    const productQuery = `INSERT INTO products (sku, price, stock_quantity, image_url) VALUES ($1, $2, $3, $4) RETURNING id`;
    const productRes = await client.query(productQuery, [productData.sku, cleanPrice, cleanStock, imageUrl]);
    const productId = productRes.rows[0].id;
    
    // Insère le produit pour le FR et le EN simultanément
    const transQuery = `INSERT INTO product_translations (product_id, language_code, name, description, slug) VALUES ($1, $2, $3, $4, $5)`;
    // Remplacement correct pour inclure le chiffre 9 dans le slug (précédemment [^a-z0-8])
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    await client.query(transQuery, [productId, 'fr', productData.name, productData.description, slug]);
    await client.query(transQuery, [productId, 'en', productData.name, productData.description, slug]);
    
    await client.query('COMMIT');
    return productId;
  } catch (error) {
    await client.query('ROLLBACK'); throw error;
  } finally { client.release(); }
};

export const updateProduct = async (id, productData, imageUrl) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cleanPrice = parseInt(productData.price, 10);
    const cleanStock = parseInt(productData.stock_quantity, 10);

    let productQuery;
    let params;
    if (imageUrl) {
      productQuery = `UPDATE products SET sku = $1, price = $2, stock_quantity = $3, image_url = $4 WHERE id = $5`;
      params = [productData.sku, cleanPrice, cleanStock, imageUrl, id];
    } else {
      productQuery = `UPDATE products SET sku = $1, price = $2, stock_quantity = $3 WHERE id = $4`;
      params = [productData.sku, cleanPrice, cleanStock, id];
    }
    await client.query(productQuery, params);

    // Mise à jour des traductions FR et EN
    const updateTransQuery = `
      UPDATE product_translations 
      SET name = $1, description = $2, slug = $3 
      WHERE product_id = $4 AND language_code = $5
    `;
    // Remplacement correct pour inclure le chiffre 9 dans le slug (précédemment [^a-z0-8])
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    await client.query(updateTransQuery, [productData.name, productData.description, slug, id, 'fr']);
    await client.query(updateTransQuery, [productData.name, productData.description, slug, id, 'en']);

    await client.query('COMMIT');
    return id;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteProduct = async (id) => {
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
};
