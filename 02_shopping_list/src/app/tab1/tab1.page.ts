import { Component } from '@angular/core';
import { AlertController, IonicModule, MenuController } from '@ionic/angular';
import { ShoppingItemsService } from '../services/shopping-items.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class Tab1Page {

  constructor(
    public shoppingList: ShoppingItemsService,
    private alertController: AlertController,
    private menuController: MenuController
  ) { }

  async removeItem(item: string) {

    // Creamos el alert
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estas seguro de borrar el item?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.shoppingList.removeItem(item);
          }
        },
        {
          text: 'No',
          handler: () => {
            alert.dismiss()
          }
        }
      ]
    });

    // Mostramos el alert
    await alert.present();

  }

  onRenderItems($event) {
    console.log($event);

    // Eliminamos la posicion origen y obtenemos el item eliminado
    const item = this.shoppingList.items.splice($event.detail.from, 1)[0];
    // Colocamos el item en la nueva posicion
    this.shoppingList.items.splice($event.detail.to, 0, item);
    // Indicamos que la ordenación se ha completado
    $event.detail.complete();
    console.log(this.shoppingList.items);
  }

  async removeAll() {

    // Creamos el alert
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estas seguro de borrar todos los items?',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            this.shoppingList.removeAllItems();
            // Cerramos el menu
            this.menuController.close();
          }
        },
        {
          text: 'No',
          handler: () => {
            alert.dismiss()
          }
        }
      ]
    });

    // Mostramos el alert
    await alert.present();
  }

}
