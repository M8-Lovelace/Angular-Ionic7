import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Class } from 'src/app/models/class';
import { Filter } from 'src/app/models/filter';
import { Payment } from 'src/app/models/payment';
import { Student } from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import { TranslateService } from '@ngx-translate/core';
import { FormClassesComponent } from '../form-classes/form-classes.component';
import { ListDataComponent } from 'src/app/shared/list-data/list-data.component';
import { FilterComponent } from 'src/app/shared/filter/filter.component';
import * as moment from 'moment';

@Component({
  selector: 'app-list-classes',
  templateUrl: './list-classes.component.html',
  styleUrls: ['./list-classes.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, FormClassesComponent, ListDataComponent, FilterComponent],
  providers: [SqliteManagerService]
})
export class ListClassesComponent implements OnInit {

  // Atributos
  public classes: Class[];
  public classSelected: Class;
  public showForm: boolean;
  public filter: Filter;

  constructor(
    private sqliteService: SqliteManagerService,
    private alertService: AlertService,
    private translate: TranslateService
  ) {
    this.classes = [];
    this.showForm = false;
    this.classSelected = null;
    this.filter = new Filter();
  }

  ngOnInit() {
    this.getClasses();
  }

  getClasses() {

    // Obtenemos todos los datos necesarios
    Promise.all([
      this.sqliteService.getClasses(this.filter),
      this.sqliteService.getStudents(),
      this.sqliteService.getPayments()
    ]).then(results => {
      this.classes = results[0];
      let students = results[1];
      let payments = results[2];
      // Asociamos las clases con los estudiantes
      this.associateStudentsClasses(students);
      // Marcamos las clases que faltan por pagar
      this.needPayClasses(payments);
      console.log(this.classes);

    })

  }

  private associateStudentsClasses(students: Student[]) {
    // Recorremos las clases
    this.classes.forEach(c => {
      // Buscamos el estudiante
      let student = students.find(s => s.id == c.id_student);
      // Si existe, lo asociamos
      if (student) {
        c.student = student;
      }
    })
  }

  private needPayClasses(payments: Payment[]) {
    // Recorremos las clases
    payments.forEach(p => {
      // Buscamos la clase
      let classFound = this.classes.find(c => c.id == p.id_class);
      // si existe y no esta pagada, indicamos que falta por pagar
      if (classFound && !p.paid) {
        classFound.needPay = true;
      }
    })
  }

  updateClass(item: Class) {
    this.classSelected = item;
    this.showForm = true;
  }

  deleteClassConfirm(item: Class) {
    // evitamos problemas de scope dentro de la funcion anonima
    const self = this;
    this.alertService.alertConfirm(
      this.translate.instant('label.confirm'),
      this.translate.instant('label.confirm.message.class'),
      function () {
        self.deleteClass(item);
      }
    )
  }

  deleteClass(c: Class) {
    this.sqliteService.deleteClass(c).then(() => {
      this.alertService.alertMessage(
        this.translate.instant('label.success'),
        this.translate.instant('label.success.message.remove.class')
      )
      this.getClasses();
    }).catch(err => {
      this.alertService.alertMessage(
        this.translate.instant('label.error'),
        this.translate.instant('label.error.message.remove.class')
      )
    })
  }

  payClass(c: Class) {
    // Obtenemos el pago de la clase
    this.sqliteService.getPaymentByClass(c.id).then( (payment: Payment) => {
      if(payment){
        // Actualizamos el pago de la clase
        payment.date = moment().format("YYYY-MM-DDTHH:mm");
        payment.paid = 1;
        this.sqliteService.updatePayment(payment).then( () => {
          this.alertService.alertMessage(
            this.translate.instant('label.success'),
            this.translate.instant('label.success.message.paid.class')
          );
          this.filter = new Filter();
          this.getClasses();
        }).catch(err => console.error(err));
      }
    }).catch(err => console.error(err))
  }

  filterData($event: Filter) {
    this.filter = $event;
    console.log(this.filter);
    this.getClasses();
  }

  onShowForm() {
    this.showForm = true;
  }

  onCloseForm() {
    this.showForm = false;
    this.classSelected = null;
    this.filter = new Filter(); // Evitamos problemas de filtro
    this.getClasses();
  }
}
