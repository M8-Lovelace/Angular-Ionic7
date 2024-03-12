import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { User } from 'src/app/models/user';
import { ToastService } from 'src/app/services/toast.service';
import { Login } from 'src/app/state/auth/auth.actions';
import { AuthState } from 'src/app/state/auth/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  // Objeto donde guardaremos el usuario
  public user: User;

  constructor(
    private store: Store,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.user = new User();
  }

  login() {
    this.store.dispatch(new Login({
      email: this.user.email,
      password: this.user.password
    })).subscribe({
      next: () => {
        // Comprobamos si estamos logueados o no
        const isLogged = this.store.selectSnapshot(AuthState.isLogged);
        if (isLogged) {
          this.toastService.showToast(
            this.translate.instant('label.login.success')
          )
        } else {
          this.toastService.showToast(
            this.translate.instant('label.login.credentials.error')
          )
        }
      }, error: () => {
        this.toastService.showToast(
          this.translate.instant('label.login.error')
        )
      }
    })
  }

}
