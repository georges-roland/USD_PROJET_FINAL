import * as paymentService from './payment.service.js';

export const checkout = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await paymentService.createPaymentIntent(amount);
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
