import { Component, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ListPaymentsComponent } from '../list-payments/list-payments.component';
import { TranslateModule } from '@ngx-translate/core';
import { Filter } from 'src/app/models/filter';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    IonicModule, ListPaymentsComponent, TranslateModule
  ],
})
export class Tab3Page {

  // Obtenemos el componente de la lista de los pagos
  @ViewChild(ListPaymentsComponent) listPayments: ListPaymentsComponent;

  constructor() { }

  // Recarga al entrar
  ionViewWillEnter() {
    if (this.listPayments) {
      this.listPayments.filter = new Filter();
      this.listPayments.filter.paid = null;
      this.listPayments.getPayments();
    }
  }

}
