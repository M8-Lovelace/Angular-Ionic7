import { Injectable } from '@angular/core';
import { FCM } from '@capacitor-community/fcm';
import { Capacitor } from '@capacitor/core';
import { PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root'
})
export class FcmService {


  init() {

    const isPushNotificationAvailable = Capacitor.isPluginAvailable('PushNotifications');

    if (isPushNotificationAvailable) {

      PushNotifications.requestPermissions().then((result) => {
        if (result.receive) {
          PushNotifications.register().then(() => {
            FCM.subscribeTo({
              topic: 'events'
            })
          })
        } else {
          console.error("No granted");
        }
      });

      PushNotifications.addListener("registration", (token: Token) => {
        console.log('Token: ', token.value);
      });

      PushNotifications.addListener("pushNotificationReceived", (notification: PushNotificationSchema) => {
        console.log('Notification: ', notification);
      });

    }


  }


}
