import { Component, OnInit } from '@angular/core';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { CreatePaymentIntent } from 'src/app/models/create-payment-intent';
import { Payment } from 'src/app/models/payment';
import { ToastService } from 'src/app/services/toast.service';
import { UserOrderService } from 'src/app/services/user-order.service';
import { CreateOrder } from 'src/app/state/orders/orders.actions';
import { OrdersState } from 'src/app/state/orders/orders.state';
import { ClearPayment, CreatePaymentSheet } from 'src/app/state/stripe/stripe.actions';
import { StripeState } from 'src/app/state/stripe/stripe.state';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage {

  @Select(StripeState.payment)
  private payment$: Observable<Payment>;

  public showNewAccount: boolean;
  public step: number;
  public optionAddress: string;
  public showNewAddress: boolean;
  public address: string;
  private subscription: Subscription;

  constructor(
    public userOrderService: UserOrderService,
    private navController: NavController,
    private store: Store,
    private toastService: ToastService,
    private translate: TranslateService
  ) {

  }

  async ionViewWillEnter() {
    this.showNewAccount = false;
    this.step = 1;
    this.subscription = new Subscription();
    this.optionAddress = 'address-default';
    this.showNewAddress = false;
    this.changeOptionAddress();
    Stripe.initialize({
      publishableKey: environment.publishKey
    })
    this.detectChangesPayment();
  }

  newAccount() {
    this.showNewAccount = true;
  }

  showLogin() {
    this.showNewAccount = false;
  }

  nextStep() {
    this.step++;
  }

  previousStep() {
    this.step--
  }

  backHome() {
    this.navController.navigateForward('categories');
  }

  changeOptionAddress() {
    switch (this.optionAddress) {
      case 'address-default':
        this.showNewAddress = false;
        this.address = this.userOrderService.getUser().address;
        break;
      case 'choose-address':
        this.showNewAddress = true;
        this.address = '';
        break;
    }
  }

  payWithStripe() {

    const total = this.userOrderService.totalOrder() * 100;

    const paymentIntent: CreatePaymentIntent = {
      secretKey: environment.secretKey,
      amount: +total.toFixed(0),
      currency: 'EUR',
      customer_id: 'cus_O5Y3BpUU9oSHa3'
    };

    this.store.dispatch(new CreatePaymentSheet({ paymentIntent }));

  }

  createOrder() {

    const order = this.userOrderService.getOrder();
    order.address = this.address;

    this.store.dispatch(new CreateOrder({ order })).subscribe({
      next: () => {
        const success = this.store.selectSnapshot(OrdersState.success);
        if (success) {
          this.toastService.showToast(
            this.translate.instant('label.pay.success', { 'address': this.address })
          );
          this.userOrderService.resetOrder();
          this.navController.navigateForward('categories')

        } else {
          this.toastService.showToast(
            this.translate.instant('label.pay.fail')
          );
        }
      }, error: (err) => {
        console.error(err);
        this.toastService.showToast(
          this.translate.instant('label.pay.fail')
        );
      }
    })


  }

  detectChangesPayment() {
    const sub = this.payment$.subscribe({
      next: () => {
        const payment = this.store.selectSnapshot(StripeState.payment);
        if (payment) {
          Stripe.createPaymentSheet({
            ...payment,
            merchantDisplayName: 'DDR'
          });
          Stripe.presentPaymentSheet().then((result) => {
            console.log(result);
            if (result.paymentResult == PaymentSheetEventsEnum.Completed) {
              this.createOrder();
            } else if (result.paymentResult == PaymentSheetEventsEnum.Failed) {
              this.toastService.showToast(
                this.translate.instant('label.pay.fail')
              );
            }
          })
        }
      }
    });
    this.subscription.add(sub);
  }

  ionViewWillLeave() {
    this.store.dispatch(new ClearPayment())
    this.subscription.unsubscribe();
  }

}
