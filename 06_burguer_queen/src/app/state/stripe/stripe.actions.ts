import { CreatePaymentIntent } from "src/app/models/create-payment-intent";

export class CreatePaymentSheet {
  static readonly type = '[Stripe] Create Payment Sheet';
  constructor(public payload: { paymentIntent: CreatePaymentIntent }) { }
}

export class ClearPayment {
  static readonly type = '[Stripe] Clear payment';
}