import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserOrderService } from 'src/app/services/user-order.service';
import { ExtrasSelectedPipe } from '../extras-selected/extras-selected.pipe';

@Component({
  selector: 'app-list-products-order',
  templateUrl: './list-products-order.component.html',
  styleUrls: ['./list-products-order.component.scss'],
  standalone: true,
  imports: [
    IonicModule, CommonModule, FormsModule, TranslateModule, ExtrasSelectedPipe
  ]
})
export class ListProductsOrderComponent {

  constructor(
    public userOrderService: UserOrderService
  ) { }

}
