import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Student } from 'src/app/models/student';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import { ListDataComponent } from 'src/app/shared/list-data/list-data.component';
import { FormStudentComponent } from '../form-student/form-student.component';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-list-students',
  templateUrl: './list-students.component.html',
  styleUrls: ['./list-students.component.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule, 
    ListDataComponent, 
    FormStudentComponent,
    TranslateModule
  ]
})
export class ListStudentsComponent implements OnInit {

  // Atributos
  public students: Student[];
  public studentSelected: Student;
  public showForm: boolean;

  constructor(
    private sqliteService: SqliteManagerService,
    private alertService: AlertService,
    private translate: TranslateService
  ) {
    this.showForm = false;
    this.students = [];
    this.studentSelected = null;
  }

  ngOnInit() {
    this.getStudents()
  }

  getStudents(search?: string) {
    // Obtengo los estudiantes
    this.sqliteService.getStudents(search).then((students: Student[]) => {
      this.students = students;
      console.log(this.students);
    })
  }

  onShowForm() {
    this.showForm = true;
  }

  onCloseForm() {
    this.showForm = false;
    this.studentSelected = null;
    this.getStudents();
  }

  updateStudent(item: Student) {
    this.studentSelected = item;
    this.showForm = true;
  }

  deleteStudentConfirm(item: Student) {
    // evitamos problemas de scope dentro de la funcion anonima
    const self = this;
    this.alertService.alertConfirm(
      this.translate.instant('label.confirm'),
      this.translate.instant('label.confirm.message.student'),
      function () {
        self.deleteStudent(item);
      }
    )
  }

  deleteStudent(student: Student) {
    this.sqliteService.deleteStudent(student).then(() => {
      this.alertService.alertMessage(
        this.translate.instant('label.success'),
        this.translate.instant('label.success.message.remove.student')
      );
      this.getStudents();
    }).catch(err => {
      console.error(err);
      this.alertService.alertMessage(
        this.translate.instant('label.error'),
        this.translate.instant('label.error.message.remove.student')
      );
    })
  }

  filterList($event) {
    console.log($event.detail.value);
    this.getStudents($event.detail.value);
  }
}
