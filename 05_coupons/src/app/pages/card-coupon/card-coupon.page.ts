import { Component } from '@angular/core';
import { IonicModule, NavParams } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';


@Component({
  selector: 'app-card-coupon',
  templateUrl: './card-coupon.page.html',
  styleUrls: ['./card-coupon.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    QRCodeModule
  ]
})
export class CardPage {
  
  public QRCode: string;

  constructor(
    private navParams: NavParams
  ) {
  }

  ngOnInit() {
    // Genero el QRCode
    this.QRCode = JSON.stringify(this.navParams.data['coupons']);
  }
}
