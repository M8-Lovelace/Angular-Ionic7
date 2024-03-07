import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreateOrder } from './orders.actions';
import { OrdersService } from './orders.service';

export class OrdersStateModel {
  success: boolean;
}

const defaults = {
  success: false
};

@State<OrdersStateModel>({
  name: 'orders',
  defaults
})
@Injectable()
export class OrdersState {

  @Selector()
  static success(state: OrdersStateModel) {
    return state.success;
  }

  constructor(private ordersService: OrdersService) {

  }

  @Action(CreateOrder)
  add({ getState, setState }: StateContext<OrdersStateModel>, { payload }: CreateOrder) {
    return this.ordersService.createOrder(payload.order).then((success: boolean) => {
      setState({
        success
      })
    })
  }
}
