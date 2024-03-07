import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) { }

  async showToast(message: string, duration = 5000) {
    // Creo el toast
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
    });

    // Presento el toast
    await toast.present();
  }

}
