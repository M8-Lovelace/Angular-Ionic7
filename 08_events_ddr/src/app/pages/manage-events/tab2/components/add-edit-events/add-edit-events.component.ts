import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Device } from '@capacitor/device';
import { NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { EventDDR } from 'src/app/models/event.ddr';
import { AlertService } from 'src/app/services/alert.service';
import { ToastService } from 'src/app/services/toast.service';
import { CreateEvent, GetFutureEvents, UpdateEvent } from 'src/app/state/events/events.actions';
import { EventsState } from 'src/app/state/events/events.state';
import { SendNotification } from 'src/app/state/notifications/notifications.actions';
import { NotificationsState } from 'src/app/state/notifications/notifications.state';

@Component({
  selector: 'app-add-edit-events',
  templateUrl: './add-edit-events.component.html',
  styleUrls: ['./add-edit-events.component.scss'],
})
export class AddEditEventsComponent implements OnInit {

  // Atributos
  public edit: boolean;
  public showEnd: boolean;
  public formEvents: FormGroup;
  public event: EventDDR;
  public minDate: string;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private alertService: AlertService,
    private store: Store,
    private toastService: ToastService,
    private navController: NavController,
    private navParams: NavParams
  ) { }

  ngOnInit() {
    this.initEvent();
  }

  initEvent() {

    // Obtenemos el evento desde el navParams
    this.event = this.navParams.data["event"];

    // Sino hay evento, lo creamos
    if (!this.event) {
      this.edit = false;
      this.event = new EventDDR();
      this.showEnd = false;
    } else {
      this.edit = true;
      this.showEnd = this.event.end != null;
    }

    // Minima fecha es ahora
    this.minDate = moment().format('YYYY-MM-DDTHH:mm');

    // Damos valores al formulario y establecemos validadores
    this.formEvents = this.fb.group({
      id: new FormControl(this.event.id),
      title: new FormControl(this.event.title, [
        Validators.required
      ]),
      start: new FormControl(this.event.start ? this.event.start : moment().format('YYYY-MM-DDTHH:mm')),
      end: new FormControl(this.event.end ? this.event.end : moment().format('YYYY-MM-DDTHH:mm')),
      type: new FormControl(this.event.type ? this.event.type : 'blog', [
        Validators.required
      ]),
      url: new FormControl(this.event.url, [
        Validators.required,
        Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
      ]),
      description: new FormControl(this.event.description, [
        Validators.required
      ]),
    })

  }

  addEditEvent() {

    console.log(this.formEvents.value);

    // Formulario valido
    if (this.formEvents.valid) {

      // Obtenemos el evento del formulario
      this.event = this.formEvents.value as EventDDR;

      // Eliminamos la fecha de fin del evento si no esta el toggle marcado
      if (!this.showEnd) {
        this.event.end = null;
      }

      if (this.edit) {
        this.store.dispatch(new UpdateEvent({ event: this.event })).subscribe({
          next: () => {
            const success = this.store.selectSnapshot(EventsState.success);
            if (success) {
              this.toastService.showToast(
                this.translate.instant('label.edit.event.success')
              );
              // Actualizamos eventos
              this.store.dispatch(new GetFutureEvents());
              this.navController.navigateForward('/tabs/tab1')
            } else {
              this.toastService.showToast(
                this.translate.instant('label.edit.event.error')
              );
            }
          }, error: (error) => {
            console.error(error);
            this.toastService.showToast(
              this.translate.instant('label.edit.event.success')
            );
          }
        })
      } else {
        this.store.dispatch(new CreateEvent({ event: this.event })).subscribe({
          next: async () => {
            const success = this.store.selectSnapshot(EventsState.success);
            if (success) {

              this.toastService.showToast(
                this.translate.instant('label.add.event.success')
              );

              // Si estamos en Android, mandamos una notificación
              const info = await Device.getInfo();

              if(info.platform == 'android'){
                this.store.dispatch(new SendNotification({ title: this.event.title, body: this.event.description })).subscribe({
                  next: () => {
                    const success = this.store.selectSnapshot(NotificationsState.success);
                    console.log("Envio notificacion: " + success);
                  }
                })
              }
              
              // Reiniciamos el evento
              this.newEvent();
              // Actualizamos eventos
              this.store.dispatch(new GetFutureEvents());
              this.navController.navigateForward('/tabs/tab1')

            } else {
              this.toastService.showToast(
                this.translate.instant('label.add.event.error')
              );
            }
          }, error: (error) => {
            this.toastService.showToast(
              this.translate.instant('label.add.event.error')
            );
          }
        })
      }
    } else {

      // Creamos la lista de errores
      let errors = '<ul>';

      if (this.formEvents.get('title').errors && this.formEvents.get('title').errors["required"]) {
        errors += '<li>' + this.translate.instant('label.error.title') + '</li>';
      }

      if (this.formEvents.get('description').errors && this.formEvents.get('description').errors["required"]) {
        errors += '<li>' + this.translate.instant('label.error.description') + '</li>';
      }

      if (this.formEvents.get('url').errors && this.formEvents.get('url').errors["required"]) {
        errors += '<li>' + this.translate.instant('label.error.url') + '</li>';
      }

      if (this.formEvents.get('url').errors && this.formEvents.get('url').errors["pattern"]) {
        errors += '<li>' + this.translate.instant('label.error.url.pattern') + '</li>';
      }

      errors += '</ul>';

      // Mostramos los errores
      this.alertService.alertSuccess(
        this.translate.instant('label.error'),
        errors
      );

    }

  }

  changeShowEnd() {
    this.showEnd = !this.showEnd;
    // Actualizamos el valor del formEvents
    if (this.showEnd) {
      this.formEvents.patchValue({
        end: moment().format('YYYY-MM-DDTHH:mm')
      })
    } else {
      this.formEvents.patchValue({
        end: null
      })
    }
  }

  newEvent() {
    this.edit = false;
    this.showEnd = false;
    this.event = new EventDDR();
    this.formEvents.patchValue({
      id: '',
      title: '',
      start: moment().format('YYYY-MM-DDTHH:mm'),
      end: moment().format('YYYY-MM-DDTHH:mm'),
      type: 'blog',
      url: '',
      description: '',
    })
  }

}
