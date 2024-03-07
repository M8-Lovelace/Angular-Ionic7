import { Component } from '@angular/core';
import { Device } from '@capacitor/device';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import config from 'capacitor.config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public load: boolean;

  constructor(
    private platform: Platform,
    private translate: TranslateService
  ) {
    // Idioma por defecto
    this.translate.setDefaultLang('es');
    this.load = false;
    this.initApp();
  }

  initApp() {

    this.platform.ready().then(async () => {

      // Lenguaje del dispositivo
      const language = await Device.getLanguageCode();

      // Si existe un valor, indicamos que usaremos ese idioma
      if (language.value) {
        this.translate.use(language.value.slice(0, 2))
      }

      // habilitamos el plugin de HTTP cuando descarguemos las traducciones
      config.plugins.CapacitorHttp.enabled = true;

      // Iniciamos la aplicación
      this.load = true;

    })

  }
}
