import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SendNotification } from './notifications.actions';
import { NotificationsService } from './notifications.service';

export class NotificationsStateModel {
  success: boolean
}

const defaults = {
  success: false
};

@State<NotificationsStateModel>({
  name: 'notifications',
  defaults
})
@Injectable()
export class NotificationsState {

  @Selector()
  static success(state: NotificationsStateModel) {
    return state.success;
  }

  constructor(private notificationsService: NotificationsService) { }

  @Action(SendNotification)
  sendNotification({ patchState }: StateContext<NotificationsStateModel>, { payload }: SendNotification) {
    return this.notificationsService.sendNotification(payload.title, payload.body).then((success: boolean) => {
      patchState({
        success
      })
    })
  }
}
