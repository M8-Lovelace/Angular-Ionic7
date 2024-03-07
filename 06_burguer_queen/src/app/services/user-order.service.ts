import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Preferences } from '@capacitor/preferences';
import { KEY_ORDER } from '../constants/constants';
import { Product } from '../models/product';
import { QuantityProduct } from '../models/quantity-product';
import { isEqual, remove } from 'lodash-es';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserOrderService {

  private order: Order;

  constructor() {
    this.initOrder();
  }

  async initOrder() {
    // Comprobamos si la orden existe en Preferences
    const order = await Preferences.get({ key: KEY_ORDER });
    if (!order.value) {
      // Iniciamos la orden
      this.clear();
    } else {
      // Parseamos la orden
      this.order = JSON.parse(order.value);
    }
  }

  async saveOrder() {
    // Guardamos la orden en Preferences
    await Preferences.set({ key: KEY_ORDER, value: JSON.stringify(this.order) });
  }

  async resetOrder() {
    // reinicio los productos
    this.order.products = [];
    await this.saveOrder();
  }

  async clear() {
    // Volvemos a crear la orden
    this.order = new Order();
    this.order.products = [];
    await this.saveOrder();
  }

  getOrder() {
    return this.order;
  }

  getProducts() {
    return this.order.products;
  }

  numProducts() {
    if (this.order && this.order.products.length > 0) {
      // suma de las cantidades
      return this.order.products
        .reduce(
          (acum: number, value: QuantityProduct) =>
            value.quantity + acum, 0)
    }
    return 0;
  }

  async addProduct(product: Product) {

    // Busco el producto
    const productFound = this.searchProduct(product);

    // Si existe, aumentamos la cantidad
    if (productFound) {
      productFound.quantity++;
    } else {
      // Sino, le ponemos 1 de cantidad
      this.order.products.push({
        product,
        quantity: 1
      })
    }

    await this.saveOrder();

  }

  async oneMoreProduct(product: Product) {

    // Busco el producto
    const productFound = this.searchProduct(product);

    // Si existe, aumentamos la cantidad
    if (productFound) {
      productFound.quantity++;
    }

    await this.saveOrder();

  }

  async oneLessProduct(product: Product) {

    // Busco el producto
    const productFound = this.searchProduct(product);

     // Si existe, decrementamos la cantidad
    if (productFound) {
      productFound.quantity--;
      // Si se queda a cero, lo eliminamos
      if (productFound.quantity == 0) {
        this.removeProduct(product);
      }
    }

    await this.saveOrder();
  }

  async removeProduct(product: Product) {
    // Elimino los productos iguales que son iguales al que hemos pasado
    remove(this.order.products, p => isEqual(p.product, product));
    await this.saveOrder();
  }

  priceProduct(product: Product) {

    // Precio base
    let total = product.price;

    // si existe los extras calculamos el precio total
    if (product.extras) {
      product.extras.forEach(extra => {
        extra.blocks.forEach(block => {
          if (block.options.length == 1 && block.options[0].activate) {
            total += block.options[0].price;
          } else if (block.options.length > 1) {
            const option = block.options.find(op => op.activate);
            if (option) {
              total += option.price;
            }
          }
        })
      })
    }

    return +total.toFixed(2);
  }

  totalPrice(quantityProduct: QuantityProduct) {

    // Precio del producto por la cantidad
    const total = this.priceProduct(quantityProduct.product) * quantityProduct.quantity;

    return +total.toFixed(2);
  }

  totalOrder() {
    let total = 0;
    for (const quantityProduct of this.order.products) {
      total += this.totalPrice(quantityProduct);
    }
    return total;
  }

  private searchProduct(product: Product) {
    return this.order.products.find((p: QuantityProduct) => isEqual(p.product, product))
  }

  hasUser() {
    return this.order && this.order.user;
  }

  getUser() {
    return this.order.user;
  }

  async saveUser(user: User) {
    // eliminamos el password del usuario
    delete user.password;
    this.order.user = user;
    await this.saveOrder();
  }

}
