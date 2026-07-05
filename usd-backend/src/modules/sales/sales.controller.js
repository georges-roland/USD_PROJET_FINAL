import * as salesService from './sales.service.js';

export const checkout = async (req, res) => {
  try {
    const userId = req.user.id; // Issu du token JWT
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Le panier est vide ou mal formaté' });
    }

    const order = await salesService.createOrder(userId, items);
    
    res.status(201).json({ success: true, message: 'Commande créée avec succès', order });
  } catch (error) {
    console.error('[SALES ERROR]', error);
    if (error.message.includes('introuvable') || error.message.includes('Stock insuffisant')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Erreur lors de la création de la commande' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await salesService.getUserOrders(req.user.id);
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('[GET ORDERS ERROR]', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des commandes' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await salesService.getAllOrders();
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de la récupération des commandes globales' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await salesService.updateOrderStatus(req.params.id, status);
    res.status(200).json({ success: true, message: 'Statut mis à jour', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour' });
  }
};
