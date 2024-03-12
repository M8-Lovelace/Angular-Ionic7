import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { ListEventsComponent } from './components/list-events/list-events.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    TranslateModule
  ],
  declarations: [Tab1Page, ListEventsComponent]
})
export class Tab1PageModule {}
