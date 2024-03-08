import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Class } from 'src/app/models/class';
import { Filter } from 'src/app/models/filter';
import { Payment } from 'src/app/models/payment';
import { Student } from 'src/app/models/student';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import { TranslateModule } from '@ngx-translate/core';
import { ListDataComponent } from 'src/app/shared/list-data/list-data.component';
import { FilterComponent } from 'src/app/shared/filter/filter.component';

@Component({
  selector: 'app-list-payments',
  templateUrl: './list-payments.component.html',
  styleUrls: ['./list-payments.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FilterComponent, ListDataComponent, TranslateModule]
})
export class ListPaymentsComponent implements OnInit {

  // Atributos
  public payments: Payment[];
  public total: number;
  public filter: Filter;

  constructor(
    private sqliteService: SqliteManagerService
  ) { 
    this.payments = [];
    this.total = 0;
    this.filter = new Filter();
    this.filter.paid = null;
  }

  ngOnInit() {
    this.getPayments();
  }

  getPayments(){

    // Obtenemos los datos necesarios
    Promise.all([
      this.sqliteService.getPayments(this.filter),
      this.sqliteService.getClasses(),
      this.sqliteService.getStudents()
    ]).then ( (results) => {
      this.payments = results[0];
      let classes = results[1];
      let students = results[2];
      // Asociamos los pagos con las clases y estudiantes
      this.associateObjects(classes, students);
      console.log(this.payments);
      // Calculamos el total
      this.calculateTotal();
      console.log(this.total);
      
    })

  }

  calculateTotal(){
    this.total = this.payments.reduce( 
      (acum: number, payment: Payment) => 
      acum + payment.class.price, 0)
  }

  associateObjects(classes: Class[], students: Student[]){
    // Recorro los pagos
    this.payments.forEach(p => {
      // Busco la clase y la asocio
      p.class = classes.find(c => c.id == p.id_class);
      if(p.class){
        // Busco el estudiante y lo asocio
        p.class.student = students.find(s => s.id == p.class.id_student);
      }
    })
  }

  filterData($event: Filter){
    this.filter = $event;
    this.getPayments();
  }

}
