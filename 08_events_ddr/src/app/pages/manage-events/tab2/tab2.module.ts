import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';

import { Tab2PageRoutingModule } from './tab2-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddEditEventsComponent } from './components/add-edit-events/add-edit-events.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    TranslateModule,
    ReactiveFormsModule
  ],
  declarations: [
    Tab2Page, 
    AddEditEventsComponent, 
    LoginComponent
  ]
})
export class Tab2PageModule { }
