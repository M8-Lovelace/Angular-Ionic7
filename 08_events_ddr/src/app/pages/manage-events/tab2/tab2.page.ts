import { Component, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Logout } from 'src/app/state/auth/auth.actions';
import { AuthState } from 'src/app/state/auth/auth.state';
import { AddEditEventsComponent } from './components/add-edit-events/add-edit-events.component';
import { NavParams } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  // Selects

  @Select(AuthState.isLogged)
  isLogged$: Observable<boolean>;

  // Viewchild
  @ViewChild(AddEditEventsComponent, { static: false }) manage: AddEditEventsComponent;

  constructor(
    private store: Store,
    private navParams: NavParams
  ) { }

  ionViewWillEnter(){
    // Llamamos a initEvent para actualizar el evento
    if(this.manage){
      this.manage.initEvent();
    }
  }

  // Al salir de la pagina, limpiamos en evento del navParams
  ionViewWillLeave(){
    this.navParams.data["event"] = null;
  }

  logout(){
    this.store.dispatch(new Logout());
  }

}
