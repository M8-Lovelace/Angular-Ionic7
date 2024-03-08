import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ListClassesComponent } from '../list-classes/list-classes.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ListClassesComponent, TranslateModule]
})
export class Tab2Page {

  constructor() {}

}
