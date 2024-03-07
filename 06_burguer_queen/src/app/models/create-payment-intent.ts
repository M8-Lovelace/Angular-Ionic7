export class CreatePaymentIntent {
    secretKey: string; // Sacado de stripe
    amount?: number; // Cantidad del pago (multiplicar por 100)
    currency?: string; // EUR, USD, etc.
    customer_id?: string; // Id del cliente, sacado de stripe
}