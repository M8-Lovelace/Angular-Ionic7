import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Student } from 'src/app/models/student';
import { AlertService } from 'src/app/services/alert.service';
import { SqliteManagerService } from 'src/app/services/sqlite-manager.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-student',
  templateUrl: './form-student.component.html',
  styleUrls: ['./form-student.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule],
  providers: [TranslateService]
})
export class FormStudentComponent implements OnInit {

  // Inputs
  @Input() student: Student;
  
  // Outputs
  @Output() close: EventEmitter<boolean>;

  // Atributos
  public update: boolean;

  constructor(
    private sqliteService: SqliteManagerService,
    private translate: TranslateService,
    private alertService: AlertService
  ) { 
    this.close = new EventEmitter<boolean>();
  }

  ngOnInit() {
    // Sino nos pasan un estudiante, lo creamos nosotros
    if(!this.student){
      this.student = new Student();
    }else{
      this.update = true;
    }
  }

  createUpdateStudent(){
    
    if(this.update){
      this.sqliteService.updateStudent(this.student).then( () => {
        this.alertService.alertMessage(
          this.translate.instant('label.success'),
          this.translate.instant('label.success.message.edit.student')
        );
        this.closeForm();
      }).catch(err => {
        this.alertService.alertMessage(
          this.translate.instant('label.error'),
          this.translate.instant('label.error.message.edit.student')
        );
      })
    }else{
      this.sqliteService.createStudent(this.student).then( () => {
        this.alertService.alertMessage(
          this.translate.instant('label.success'),
          this.translate.instant('label.success.message.add.student')
        );
        this.closeForm();
      }).catch(err => {
        this.alertService.alertMessage(
          this.translate.instant('label.error'),
          this.translate.instant('label.error.message.add.student')
        );
      })
    }

  }

  closeForm(){
    this.close.emit(true);
  }

}
