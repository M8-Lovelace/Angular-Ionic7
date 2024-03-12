import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Database, get, getDatabase, orderByChild, push, query, ref, remove, set, startAt } from '@angular/fire/database';
import * as moment from 'moment';
import { EventDDR } from 'src/app/models/event.ddr';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private database: Database;

  constructor(afApp: FirebaseApp) {
    // Obtenemos la database de firebase
    this.database = getDatabase(afApp);
  }

  createEvent(event: EventDDR) {
    return new Promise((resolve, reject) => {
      try {
        // Obtenemos la referencia de eventos
        let eventRef = ref(this.database, 'eventos');
        // Creamos una nueva referencia
        const newRef = push(eventRef);
        // Actualizamos el id del evento
        event.id = newRef.key;
        // Guardo el evento en firebase
        set(newRef, {
          ...event
        })
        resolve(true);
      } catch (error) {
        reject(false);
      }

    })
  }

  updateEvent(event: EventDDR) {
    return new Promise((resolve, reject) => {
      try {
        // Obtenemos la referencia del evento
        let eventRef = ref(this.database, 'eventos/' + event.id);
        // Actualizo el evento en firebase
        set(eventRef, {
          ...event
        })
        resolve(true);
      } catch (error) {
        reject(false);
      }

    })
  }

  deleteEvent(id: string) {
    return new Promise((resolve, reject) => {
      try {
        // Obtenemos la referencia del evento
        let eventRef = ref(this.database, 'eventos/' + id);
        // Elimino el evento
        remove(eventRef);
        resolve(true);
      } catch (error) {
        reject(false);
      }

    })
  }

  getFutureEvents() {

    // Creo la query
    // Ordenamos por la propiedad start
    // Filtramos los mayores que hoy
    const queryDB = query(
      ref(this.database, 'eventos'), 
      orderByChild('start'), 
      startAt(moment().format('YYYY-MM-DDTHH:mm')))

    return get(queryDB);
  }

}
