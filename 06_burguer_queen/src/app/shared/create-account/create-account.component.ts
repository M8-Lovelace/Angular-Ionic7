import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { User } from 'src/app/models/user';
import { ToastService } from 'src/app/services/toast.service';
import { Login } from 'src/app/state/auth/auth.actions';
import { CreateUser, GetUser } from 'src/app/state/users/users.actions';
import { UsersState } from 'src/app/state/users/users.state';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class CreateAccountComponent {

  @Output() back: EventEmitter<boolean>;
  @Output() doCreateAccount: EventEmitter<boolean>;

  // Objeto donde guardaremos los datos del usuario
  public user: User;

  constructor(
    private store: Store,
    private toastService: ToastService,
    private translate: TranslateService
  ) {
    this.back = new EventEmitter<boolean>();
    this.doCreateAccount = new EventEmitter<boolean>();
    this.user = new User();
  }

  createAccount() {
    // Creamos el usuario
    this.store.dispatch(new CreateUser({ user: this.user })).subscribe({
      next: () => {
        const success = this.store.selectSnapshot(UsersState.success);
        if (success) {
          this.toastService.showToast(
            this.translate.instant('label.create.account.success')
          )
          // Nos logueamos y obtenemos el usuario para el token
          this.store.dispatch(new Login({
            email: this.user.email,
            password: this.user.password
          })).subscribe({
            next: () => {
              this.store.dispatch(new GetUser({ email: this.user.email }))
            }
          })
          // indicamos que hemos creado una cuenta
          this.doCreateAccount.emit(true);
        } else {
          this.toastService.showToast(
            this.translate.instant('label.create.account.error')
          )
        }
      }, error: () => {
        this.toastService.showToast(
          this.translate.instant('label.create.account.error')
        )
      }
    })
  }

  exit() {
    // indicamos que vamos a salir
    this.back.emit(true);
  }

}
