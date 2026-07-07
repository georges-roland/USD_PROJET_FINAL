import Stripe from 'stripe';
import { env } from '../../config/env.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_value_change_me');

export const createPaymentIntent = async (amount, currency = 'eur') => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount, // montant en centimes
    currency: currency,
    payment_method_types: ['card'],
  });
  return paymentIntent;
};
