import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private alertController: AlertController,
    private translate: TranslateService
  ) { }

  async alertMessage(
    header: string,
    message: string
  ){
    const alert = await this.alertController.create({
      header, 
      message, 
      buttons: ['OK']
    })
    await alert.present();
  }

  async alertConfirm(
    header: string,
    message: string,
    functionOk: Function // Funcion a ejecutar cuando le demos a OK
  ){

    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: this.translate.instant('label.cancel'),
          role: 'cancel',
          handler: () => {}
        },
        {
          text: this.translate.instant('label.ok'),
          role: 'confirm',
          handler: () => {
            functionOk();
          }
        }
      ]
    })
    await alert.present();
  }

}
