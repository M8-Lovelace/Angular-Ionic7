import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { Product } from 'src/app/models/product';
import { ProductExtraOption } from 'src/app/models/product-extra-option';
import { ToastService } from 'src/app/services/toast.service';
import { UserOrderService } from 'src/app/services/user-order.service';
import { GetProductById } from 'src/app/state/products/products.actions';
import { ProductsState } from 'src/app/state/products/products.state';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage {

  public product: Product;
  public total: number;

  constructor(
    private navController: NavController,
    private navParams: NavParams,
    private store: Store,
    private userOrderService: UserOrderService,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.product = null;
  }

  ionViewWillEnter() {

    // Obtenemos el producto pasado por navParams
    console.log(this.navParams.data['product']);
    this.product = this.navParams.data['product'];

    // Si es un extra obtengo el total base
    if (this.product && this.product.extras) {
      this.total = this.product.price;
    }

    if (!this.product) {
      this.navController.navigateForward('categories');
    }

  }

  changeMultipleOption($event, options: ProductExtraOption[]) {
    // Actualizamos el activate de las opciones
    options.forEach(op => op.activate = $event.detail.value == op.name);
    // Actualizar el precio del producto
    this.calculateTotal();
  }

  calculateTotal() {
    // Actualizar el precio del producto
    this.total = this.userOrderService.priceProduct(this.product);
  }

  getProduct($event) {

    this.store.dispatch(new GetProductById({ id: this.product._id })).subscribe({
      next: () => {
        this.product = this.store.selectSnapshot(ProductsState.product);
        this.calculateTotal();
      },
      complete: () => {
        $event.target.complete();
      }
    })

  }

  addProductOrder() {

    // Añadimos el producto a la orden
    this.userOrderService.addProduct(this.product);

    console.log(this.userOrderService.getProducts());

    this.toastService.showToast(
      this.translate.instant('label.product.add.success')
    );

    this.navController.navigateRoot('/');

  }

}
