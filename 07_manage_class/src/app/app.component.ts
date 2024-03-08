import { Component, inject } from '@angular/core';
import { IonicModule, Platform } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SqliteManagerService } from './services/sqlite-manager.service';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {

  public isWeb: boolean;
  public load: boolean;

  constructor(
    private platform: Platform,
    private translate: TranslateService,
    private sqliteService: SqliteManagerService
  ) {
    this.load = false;
    this.isWeb = false;
    this.translate.setDefaultLang('es');
    this.initApp();
  }

  initApp() {

    // Esperamos a que la plataforma este listo
    this.platform.ready().then(async () => {

      // Lenguaje del dispositivo
      const language = await Device.getLanguageCode();
      // Datos del dispositivo
      const info = await Device.getInfo();

      this.isWeb = info.platform == 'web';

      // Indicamos que lenguaje de usar
      if (language.value) {
        this.translate.use(language.value.slice(0, 2));
      }

      // Inicializamos el servicio
      this.sqliteService.init();
      // Esperamos a que este listo
      this.sqliteService.dbReady.subscribe(isReady => {
        this.load = isReady;
      })

    })

  }


}

