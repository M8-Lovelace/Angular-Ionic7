import { IonicModule, PopoverController } from '@ionic/angular';
import { Student } from '../../../models/student';
import { SqliteManagerService } from '../../../services/sqlite-manager.service';
import { Filter } from '../../../models/filter';
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-content',
  templateUrl: './filter-content.component.html',
  styleUrls: ['./filter-content.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule, FormsModule]
})
export class FilterContentComponent implements OnInit {

  // Inputs
  @Input() filter: Filter;
  @Input() payment: boolean;

  // Atributos
  public students: Student[];

  constructor(
    private sqliteService: SqliteManagerService,
    private popoverController: PopoverController
  ) {
    this.students = [];
  }

  ngOnInit() {
    // Obtenemos los estudiantes
    this.sqliteService.getStudents().then((students: Student[]) => {
      this.students = students;
    })
  }

  filterData(){
    // Cerramos el popover devolviendo el filtro
    this.popoverController.dismiss(this.filter);
  }

  reset(){
    // Cerramos el popover devolviendo el filtro reseteado
    this.filter = new Filter();
    this.popoverController.dismiss(this.filter);
  }

}
