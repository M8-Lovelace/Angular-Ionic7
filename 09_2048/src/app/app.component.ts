import { Component } from '@angular/core';
import { AdMob, AdmobConsentDebugGeography, AdmobConsentStatus } from '@capacitor-community/admob';
import { IonicModule, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule],
  providers: [ScreenOrientation]
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private translateService: TranslateService,
    private screenOrientation: ScreenOrientation
  ) {
    this.translateService.setDefaultLang('es');
    // Bloqueamos la orientacion
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    this.initApp();
  }

  initApp() {
    this.platform.ready().then(async () => {

      // Idioma
      const language = await Device.getLanguageCode();

      if (language.value) {
        this.translateService.use(language.value.slice(0, 2));
      }

      // Inicializamos admob
      AdMob.initialize({
        testingDevices: [
          'aee35788-afbb-44b2-8cab-c207c9066f10', '4d18763D-8763-4348-A22A-99D7AF964616'
        ],
        initializeForTesting: true
      });

      // Formulario de consentimiento
      const consentInfo = await AdMob.requestConsentInfo({
        debugGeography: AdmobConsentDebugGeography.EEA,
        testDeviceIdentifiers: [
          'aee35788-afbb-44b2-8cab-c207c9066f10', '4d18763D-8763-4348-A22A-99D7AF964616'
        ]
      });

      // Si hay consentimiento, lo guardamos
      if (consentInfo.isConsentFormAvailable && consentInfo.status === AdmobConsentStatus.REQUIRED) {
        const { status } = await AdMob.showConsentForm();
        await Preferences.set({
          key: 'statusBanner',
          value: status,
        });
      }

    })


  }

}
