import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list-data',
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, TranslateModule],

  providers: [TranslateService]
})
export class ListDataComponent {

  // Inputs
  @Input({ required: true }) data: any[];
  @Input() emptyText: string;
  @Input() addText: string;
  @Input() showAdd: boolean = true;

  // Outputs
  @Output() add: EventEmitter<boolean>;

  // Obtiene los datos del template: templateData
  @ContentChild("templateData", { static: false }) templateData: TemplateRef<any>;

  constructor() {
    this.add = new EventEmitter<boolean>();
  }

  addData() {
    this.add.emit(true);
  }

}
