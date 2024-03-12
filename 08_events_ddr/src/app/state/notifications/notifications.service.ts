
import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  sendNotification(title: string, body: string){
    return CapacitorHttp.post({
      url: 'https://fcm.googleapis.com/fcm/send',
      params: {},
      data: {
        notification: {
          title, // Titulo de la notificacion
          body // Cuerpo de la notificacion
        },
        to: '/topics/events' // Donde queremos mandarlo
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=${environment.serverKey}` // Lo obtenemos de firebase
      }
    }).then( (response: HttpResponse) => {
      console.log(response);
      // Si se procesa al menos un dispositivo, se mando correctamente
      return response.data.success > 0;
    })
  }
}
