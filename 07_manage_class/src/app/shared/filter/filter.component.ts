import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule, PopoverController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Filter } from 'src/app/models/filter';
import { FilterContentComponent } from './filter-content/filter-content.component';
import * as moment from 'moment';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule, FilterContentComponent]
})
export class FilterComponent {

  // Inputs
  @Input() filter: Filter;
  @Input() payment: boolean = false;

  // Outputs
  @Output() filterData: EventEmitter<Filter>;

  // Atributos
  public showFilter: boolean;

  constructor(
    private popoverController: PopoverController
  ) {
    this.showFilter = false;
    this.filterData = new EventEmitter<Filter>();
  }

  ngOnInit() {
    // Si la fecha de inicio no esta seteada, se lo hacemos aqui
    if (!this.filter.date_start) {
      this.filter.date_start = moment().format("YYYY-MM-DDTHH:mm");
    }
    // Si la fecha de fin no esta seteada, se lo hacemos aqui
    if (!this.filter.date_end) {
      this.filter.date_end = moment().format("YYYY-MM-DDTHH:mm");
    }
    // Si paid no esta seteada, se lo hacemos aqui
    if (this.filter.paid == null) {
      this.filter.paid = false;
    }
  }

  async createPopover(event: any) {
    // Creamos el popover
    const popover = await this.popoverController.create({
      component: FilterContentComponent, // Componente a cargar
      backdropDismiss: true, // Si pulsamos fuera, se cierra
      event, // Donde lo queremos incrustar
      cssClass: 'custom-popover-content', // Clase adicional
      componentProps: { // Inputs del componente
        filter: this.filter,
        payment: this.payment
      }
    })

    // Accion cuando se cierra el popover
    popover.onDidDismiss().then((event) => {
      console.log(event);
      this.showFilter = false;
      // Sino viene nada, no hacemos nada
      if (event.data) {
        this.filterData.emit(event.data);
      }

    })

    // Mostramos el popover
    await popover.present();
  }

  showHideFilter($event) {

    this.showFilter = !this.showFilter;

    if (this.showFilter) {
      // Mostramos el popover, $event es para hacer referencia al boton donde lo insertamos
      this.createPopover($event);
    }

  }

}
