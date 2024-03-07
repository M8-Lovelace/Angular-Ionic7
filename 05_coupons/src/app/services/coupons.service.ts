import { Injectable } from '@angular/core';
import { Coupon } from '../models/coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponsService {

  constructor() { }

  getCoupons() {

    // Obtenemos todos los datos del fichero data.json
    return fetch('./assets/data/data.json').then(async res => {
      // Convierto la respuesta a json y la convierto en cupones
      const coupons: Coupon[] = await res.json() as Coupon[];
      // Dejo el active a false
      coupons.forEach(c => c.active = false);
      // Devuelvo los cupones
      return Promise.resolve(coupons);
    }).catch(err => {
      console.error(err);
      return Promise.reject([]);
    })

  }
}
