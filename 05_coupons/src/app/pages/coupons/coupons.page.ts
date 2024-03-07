import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertController, IonicModule, NavController, NavParams } from '@ionic/angular';
import { Coupon } from 'src/app/models/coupon';
import { CouponsService } from 'src/app/services/coupons.service';
import { ToastService } from 'src/app/services/toast.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class CouponsPage implements OnInit {

  public couponsActive: boolean;
  public showCamera: boolean;
  public coupons: Coupon[];

  constructor(
    private couponsService: CouponsService,
    private navParams: NavParams,
    private navController: NavController,
    private alertController: AlertController,
    private toastService: ToastService
  ) {
    this.coupons = [];
    this.couponsActive = false;
    this.showCamera = false;
  }

  ngOnInit() {
    // recojo los cupones iniciales
    this.couponsService.getCoupons().then((coupons: Coupon[]) => {
      this.coupons = coupons;
      console.log(this.coupons);
    })
  }

  changeActive(coupon: Coupon) {
    // Cambio el valor de active
    coupon.active = !coupon.active;
    // Compruebo si existe o no un cupon activo
    this.couponsActive = this.coupons.some(c => c.active);
  }

  goToCard() {
    // paso los cupones activos
    this.navParams.data["coupons"] = this.coupons.filter(c => c.active);
    // Voy a la ventana card-coupon
    this.navController.navigateForward('card-coupon');
  }

  async startCamera() {

    // Compruebo los permisos de la camara
    const perms = await BarcodeScanner.checkPermission({ force: true });

    // Si tengo permisos
    if (perms.granted) {

      this.showCamera = true;

      // Inicia el escaneo de QR
      const result = await BarcodeScanner.startScan();

      // Si detecta un QR
      if (result.hasContent) {
        console.log(result.content);

        try {

          // Parseo el objeto
          // Sino es un objeto vamos al catch
          let coupon: Coupon = JSON.parse(result.content);

          // Compruebo si el cupon valido
          if (this.isCouponValid(coupon)) {
            this.toastService.showToast('QR escaneado correctamente');
            // Añado el cupon
            this.coupons.push(coupon);
          } else {
            this.toastService.showToast('QR error');
          }
        } catch (error) {
          this.toastService.showToast('QR error');
          console.error(error);
        }

      }

      // Cierro la camara
      this.closeCamera();

    } else {
      // Indico que necesitamos la camara para funcionar
      const alert = await this.alertController.create({
        message: 'Esta app necesita permisos en la camara para funcionar'
      });
      await alert.present();
    }


  }

  closeCamera() {
    this.showCamera = false;
    // Paro de escanear
    BarcodeScanner.stopScan();
  }

  private isCouponValid(coupon: Coupon) {
    // Debe tener todas las propiedades validas
    return coupon && coupon.id_product && coupon.img && coupon.name && coupon.discount;
  }

}
