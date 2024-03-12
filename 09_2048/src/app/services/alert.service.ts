import { Injectable } from '@angular/core';
import { AlertButton, AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController,
    private translate: TranslateService
  ) { }

  async alertCustomButtons(header: string, message: string, buttons: AlertButton[], backdropDismiss: boolean){
    const alert = await this.alertController.create({
      header,
      message,
      buttons,
      backdropDismiss
    });

    await alert.present();
  }

  async alertConfirm(header: string, message: string, functionOk) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: this.translate.instant('label.cancel'),
          role: 'cancel',
          handler: () => {

          }
        }, {
          text: this.translate.instant('label.ok'),
          handler: () => {
            functionOk();
          }
        }
      ]
    });

    await alert.present();
  }

  async alertSuccess(header: string, message: string) {
    const alert = await this.alertController.create({
      header, message, buttons: ['OK']
    });

    await alert.present();
  }

}

