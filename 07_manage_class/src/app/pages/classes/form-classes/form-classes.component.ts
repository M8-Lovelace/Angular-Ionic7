import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Class } from 'src/app/models/class';
import { Payment } from 'src/app/models/payment';
import { Student } from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import { capSQLiteChanges } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-form-classes',
  templateUrl: './form-classes.component.html',
  styleUrls: ['./form-classes.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class FormClassesComponent implements OnInit {

  // Inputs
  @Input() classObj: Class;

  // Outputs
  @Output() close: EventEmitter<boolean>;

  // atributos
  public payment: Payment;
  public paid: boolean;
  public alreadyPaid: boolean;
  public update: boolean;
  public students: Student[];

  constructor(
    private sqliteService: SqliteManagerService,
    private alertService: AlertService,
    private translate: TranslateService
  ) {
    this.update = false;
    this.close = new EventEmitter<boolean>();
  }

  ngOnInit() {

    // Si no le pasamos una clase, estamos creando
    if (!this.classObj) {
      this.classObj = new Class();
      this.classObj.price = 0;
      this.payment = new Payment();
      this.paid = false;
      this.alreadyPaid = false;
    } else {
      // Actualizamos una clase
      this.update = true;

      // Obtenemos el pago
      this.sqliteService.getPaymentByClass(this.classObj.id).then((payment: Payment) => {
        if (payment) {
          this.payment = payment;
          // Indicamos si esta pagado o no
          this.alreadyPaid = this.payment.paid == 1;
          this.paid = this.payment.paid == 1
        } else {
          this.paid = false;
          this.payment = new Payment();
        }

      })

    }

    // Obtenemos los estudiantes
    this.sqliteService.getStudents().then((students: Student[]) => {
      this.students = students;
    })

  }

  createUpdateClass() {

    // Formateemos la fecha de la clase
    this.classObj.date_start = moment(this.classObj.date_start).format("YYYY-MM-DDTHH:mm");
    this.classObj.date_end = moment(this.classObj.date_end).format("YYYY-MM-DDTHH:mm");

    if (this.update) {
      this.sqliteService.updateClass(this.classObj).then(() => {

        // Si indicamos que esta pagado, actualizamos el pago
        if (this.paid) {
          this.payment.paid = 1;
          this.payment.date = moment(this.payment.date).format("YYYY-MM-DDTHH:mm");
          this.sqliteService.updatePayment(this.payment);
        }

        this.alertService.alertMessage(
          this.translate.instant('label.success'),
          this.translate.instant('label.success.message.edit.class')
        );
        this.closeForm();
      }).catch(err => {
        this.alertService.alertMessage(
          this.translate.instant('label.error'),
          this.translate.instant('label.error.message.edit.class')
        )
      });
    } else {
      this.sqliteService.createClass(this.classObj).then((changes: capSQLiteChanges) => {

        const idClass = changes.changes.lastId; // Obtengo el id de la clase
        // Actualizo el pago
        this.payment.id_class = idClass;

        if (this.paid) {
          this.payment.date = moment(this.payment.date).format("YYYY-MM-DDTHH:mm");
          this.payment.paid = 1;
        } else {
          this.payment.paid = 0;
        }

        // Creo el pago
        this.sqliteService.createPayment(this.payment);

        this.alertService.alertMessage(
          this.translate.instant('label.success'),
          this.translate.instant('label.success.message.add.class')
        );
        this.closeForm();
      }).catch(err => {
        this.alertService.alertMessage(
          this.translate.instant('label.error'),
          this.translate.instant('label.error.message.add.class')
        )
      });
    }

  }

  closeForm() {
    this.close.emit(true);
  }

}
