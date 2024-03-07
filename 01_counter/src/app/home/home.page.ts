import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage {

  // Atributos
  public n: number;
  public showNumber: string;

  // Inicializacion de valores
  constructor() {
    this.n = 0;
    this.showNumber = '00';
  }

  // Accion al pulsar el boton de la cabecera
  up() {
    this.n++; // this.n = this.n + 1;
    this.formatShowNumber();
  }

  // Accion al pulsar el boton del pie
  down() {
    this.n-- // this.n = this.n - 1;
    this.formatShowNumber();
  }

  // Si el numero es menor que 10 le pongo un 0 delante
  formatShowNumber() {
    if (this.n < 10) {
      this.showNumber = '0' + this.n;
    } else {
      this.showNumber = '' + this.n;
    }
  }
}
