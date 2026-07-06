import * as catalogService from './catalog.service.js';

export const getProducts = async (req, res) => {
  try {
    const lang = req.query.lang || 'fr';
    const search = req.query.search || '';
    const products = await catalogService.getProducts(lang, search);
    res.status(200).json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const createProduct = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const productId = await catalogService.createProduct(req.body, imageUrl);
    res.status(201).json({ success: true, productId });
  } catch (error) { res.status(500).json({ success: false }); }
};

export const updateProduct = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    await catalogService.updateProduct(req.params.id, req.body, imageUrl);
    res.status(200).json({ success: true });
  } catch (error) { 
    res.status(500).json({ success: false }); 
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await catalogService.deleteProduct(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) { res.status(500).json({ success: false }); }
};
