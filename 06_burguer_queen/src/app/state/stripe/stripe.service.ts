import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { CreatePaymentIntent } from 'src/app/models/create-payment-intent';
import { Payment } from 'src/app/models/payment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  createPaymentSheet(paymentIntent: CreatePaymentIntent) {
    return CapacitorHttp.post({
      url: environment.urlApi + 'stripe/intent',
      params: {},
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${paymentIntent.secretKey}` // Secret key de stripe
      },
      data: {
        ...paymentIntent
      }
    }).then((response: HttpResponse) => {
      if (response.status == 201) {
        const data = response.data as Payment;
        return data;
      }
      return null;
    }).catch(err => {
      console.error(err);
      return null;
    })
  }


}
