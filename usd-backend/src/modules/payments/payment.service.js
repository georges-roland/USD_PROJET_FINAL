import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, currency = 'eur') => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount, // montant en centimes
    currency: currency,
    payment_method_types: ['card'],
  });
  return paymentIntent;
};
