import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Flashlight } from '@awesome-cordova-plugins/flashlight/ngx';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
  providers: [Flashlight]
})
export class HomePage {
  
  // Atributo que indica si esta activada o no la linterna
  public active: boolean;

  constructor(
    private flashlight: Flashlight
  ) {
    this.active = false;
  }

  flash() {
    this.active = !this.active;

    if (this.active) {
      this.flashlight.switchOn(); // encender
    } else {
      this.flashlight.switchOff(); // apagar
    }

  }

}
