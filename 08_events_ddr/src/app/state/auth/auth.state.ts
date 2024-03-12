import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CheckIsLogged, Login, Logout } from './auth.actions';
import { AuthService } from './auth.service';
import { onAuthStateChanged } from '@angular/fire/auth';

export class AuthStateModel {
  isLogged: boolean;
}

const defaults = {
  isLogged: false
};

@State<AuthStateModel>({
  name: 'auth',
  defaults
})
@Injectable()
export class AuthState {

  @Selector()
  static isLogged(state: AuthStateModel) {
    return state.isLogged;
  }

  constructor(private authService: AuthService) { }

  @Action(CheckIsLogged)
  checkIsLogged({ setState }: StateContext<AuthStateModel>) {
    
    // Observable
    onAuthStateChanged(this.authService.getAuth(), (user) => {
      if (user) {
        setState({
          isLogged: true
        })
      }else{
        setState({
          isLogged: false
        })
      }
    })
  }

  @Action(Login)
  login({ setState }: StateContext<AuthStateModel>, { payload }: Login) {
    return this.authService.login(payload.email, payload.password).then((result) => {
      if (result) {
        setState({
          isLogged: true
        })
      }
    });
  }

  @Action(Logout)
  async logout({ setState }: StateContext<AuthStateModel>) {
    // Cerramos sesion
    this.authService.logout();
    // Indicamos que no estamos logueados
    setState({
      isLogged: false
    })
  }

}
