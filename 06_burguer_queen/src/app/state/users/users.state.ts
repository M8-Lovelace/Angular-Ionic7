import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CreateUser, GetUser } from './users.actions';
import { UsersService } from './users.service';
import { User } from 'src/app/models/user';
import { UserOrderService } from 'src/app/services/user-order.service';

export class UsersStateModel {
  success: boolean;
}

const defaults = {
  success: false
};

@State<UsersStateModel>({
  name: 'users',
  defaults
})
@Injectable()
export class UsersState {

  @Selector()
  static success(state: UsersStateModel) {
    return state.success;
  }

  constructor(
    private usersService: UsersService,
    private userOrderService: UserOrderService
  ) { }

  @Action(GetUser)
  getUser({ }: StateContext<UsersStateModel>, { payload }: GetUser) {
    return this.usersService.getUser(payload.email).then(async (user: User) => {
      await this.userOrderService.saveUser(user);
    })
  }

  @Action(CreateUser)
  createUser({ setState }: StateContext<UsersStateModel>, { payload }: CreateUser) {
    return this.usersService.createUser(payload.user).then((success: boolean) => {
      setState({
        success
      })
    })
  }

}
