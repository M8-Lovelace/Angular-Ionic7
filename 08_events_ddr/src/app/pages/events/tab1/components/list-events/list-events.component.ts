import { Component, OnInit, ViewChild } from '@angular/core';
import { Browser } from '@capacitor/browser';
import { ActionSheetController, IonSearchbar, NavController, NavParams } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { EventDDR } from 'src/app/models/event.ddr';
import { AlertService } from 'src/app/services/alert.service';
import { ToastService } from 'src/app/services/toast.service';
import { AuthState } from 'src/app/state/auth/auth.state';
import { DeleteEvent, GetFutureEvents } from 'src/app/state/events/events.actions';
import { EventsState } from 'src/app/state/events/events.state';

@Component({
  selector: 'app-list-events',
  templateUrl: './list-events.component.html',
  styleUrls: ['./list-events.component.scss'],
})
export class ListEventsComponent implements OnInit {

  // Select

  @Select(EventsState.events)
  events$: Observable<EventDDR[]>;

  // Atributos

  public events: EventDDR[];
  public eventsOriginal: EventDDR[];
  public eventSelected: EventDDR;
  public typeSearch: string;

  // Viewchild del searchbar
  @ViewChild('searchbar', { static: false }) searchbar: IonSearchbar;

  constructor(
    private store: Store,
    private actionSheetController: ActionSheetController,
    private translate: TranslateService,
    private navParams: NavParams,
    private navController: NavController,
    private alertService: AlertService,
    private toastService: ToastService
  ) {
    this.events = [];
    this.eventSelected = null;
    this.typeSearch = '';
  }

  ngOnInit() {
    this.store.dispatch(new GetFutureEvents());
    this.fetchEvents();
  }

  fetchEvents() {
    // Actualizaciones de eventos
    this.events$.subscribe({
      next: () => {
        const events = this.store.selectSnapshot(EventsState.events);
        this.events = events;
        this.eventsOriginal = events;
        this.typeSearch = '';
        if(this.searchbar){
          this.searchbar.value = '';
        }
        console.log(this.events);
      }
    })
  }

  clickEvent(event: EventDDR) {
    // guardo el evento seleccionado
    this.eventSelected = event;
    // Compruebo si estoy logueado
    const isLogged = this.store.selectSnapshot(AuthState.isLogged);

    // Si estoy logueado, muestro las acciones
    if (isLogged) {
      this.presentActions();
    } else {
      // Abro la url
      this.openUrl(this.eventSelected.url);
    }

  }

  async presentActions() {
    // Creo el panel de opciones
    const actionSheet = await this.actionSheetController.create({
      header: this.translate.instant('label.actions.event'),
      buttons: [
        {
          text: this.translate.instant('label.open.url'),
          icon: 'earth-outline',
          handler: () => {
            this.openUrl(this.eventSelected.url);
          }
        },
        {
          text: this.translate.instant('label.edit.event'),
          icon: 'pencil-outline',
          handler: () => {
            this.passEvent();
          }
        },
        {
          text: this.translate.instant('label.remove.event'),
          icon: 'trash-outline',
          handler: () => {
            this.removeEventConfirm();
          }
        },
        {
          text: this.translate.instant('label.close.options'),
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });
    // Muestro el panel de opciones
    await actionSheet.present();
  }

  passEvent() {
    // Guardo el evento seleccionado
    this.navParams.data['event'] = this.eventSelected;
    this.navController.navigateForward('/tabs/tab2')
  }

  async openUrl(url: string) {
    if (url) {
      await Browser.open({ url })
    }
  }

  removeEventConfirm() {

    // Evitamos problemas de scope
    const self = this;
    this.alertService.alertConfirm(
      this.translate.instant('label.confirm'),
      this.translate.instant('label.remove.event.message'),
      function () {
        self.removeEvent();
      }
    )

  }

  removeEvent() {
    // Llamamos a la accion de borrar evento
    this.store.dispatch(new DeleteEvent({ id: this.eventSelected.id })).subscribe({
      next: () => {
        const success = this.store.selectSnapshot(EventsState.success);
        if (success) {
          this.toastService.showToast(
            this.translate.instant('label.remove.event.success')
          );
          // Actualizamos
          this.store.dispatch(new GetFutureEvents())
        } else {
          this.toastService.showToast(
            this.translate.instant('label.remove.event.error')
          );
        }
      }, error: (error) => {
        console.error(error);
        this.toastService.showToast(
          this.translate.instant('label.remove.event.error')
        );
      }
    })
  }

  filterEvents() {
    console.log(this.searchbar.value);

    // Si hay un tipo de elemento marcado
    if (this.typeSearch) {
      this.events = this.eventsOriginal.filter(event => event.type == this.typeSearch && event.title.toLowerCase().trim().includes(this.searchbar.value.toLowerCase().trim()))
    } else {
      this.events = this.eventsOriginal.filter(event => event.title.toLowerCase().trim().includes(this.searchbar.value.toLowerCase().trim()))
    }
  }

  filterEventsByType(type: string) {
    // Si se marca dos veces el mismo, se reinicia
    if (this.typeSearch == type) {
      this.typeSearch = '';
    } else {
      this.typeSearch = type;
    }
    this.filterEvents();
  }

  refreshEvents($event){
    // refresco de eventos
    this.store.dispatch(new GetFutureEvents());
    $event.target.complete();
  }

}
