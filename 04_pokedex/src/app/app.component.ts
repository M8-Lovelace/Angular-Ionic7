import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
  providers: [ScreenOrientation]
})
export class AppComponent {
  constructor(private screenOrientation: ScreenOrientation) { 
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
  }

}
