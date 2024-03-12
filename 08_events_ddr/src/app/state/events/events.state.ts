import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreateEvent, DeleteEvent, GetFutureEvents, UpdateEvent } from './events.actions';
import { EventDDR } from 'src/app/models/event.ddr';
import { EventsService } from './events.service';
import { DataSnapshot } from '@angular/fire/database';

export class EventsStateModel {
  events: EventDDR[];
  success: boolean;
}

const defaults = {
  events: [],
  success: false
};

@State<EventsStateModel>({
  name: 'events',
  defaults
})
@Injectable()
export class EventsState {

  @Selector()
  static events(state: EventsStateModel) {
    return state.events;
  }

  @Selector()
  static success(state: EventsStateModel) {
    return state.success;
  }

  constructor(private eventsService: EventsService) { }

  @Action(CreateEvent)
  createEvent({ patchState }: StateContext<EventsStateModel>, { payload }: CreateEvent) {
    return this.eventsService.createEvent(payload.event).then((success: boolean) => {
      patchState({
        success
      })
    }).catch(err => {
      patchState({
        success: false
      })
    })
  }

  @Action(UpdateEvent)
  updateEvent({ patchState }: StateContext<EventsStateModel>, { payload }: UpdateEvent) {
    return this.eventsService.updateEvent(payload.event).then((success: boolean) => {
      patchState({
        success
      })
    }).catch(err => {
      patchState({
        success: false
      })
    })
  }

  @Action(DeleteEvent)
  deleteEvent({ patchState }: StateContext<EventsStateModel>, { payload }: DeleteEvent) {
    return this.eventsService.deleteEvent(payload.id).then((success: boolean) => {
      patchState({
        success
      })
    }).catch(err => {
      patchState({
        success: false
      })
    })
  }

  @Action(GetFutureEvents)
  getFutureEvents({ patchState }: StateContext<EventsStateModel>) {
    return this.eventsService.getFutureEvents().then( (snapshot: DataSnapshot) => {
      const events: EventDDR[] = [];
      // Recorro los valores
      snapshot.forEach(childSnapshot => {
        // Obtengo el evento
        const data = childSnapshot.val() as EventDDR;
        // Lo guardo al principio, haciendo que sea como ordenar descendentemente
        events.unshift(data);
      })
      patchState({
        events
      })
    })
  }

}
