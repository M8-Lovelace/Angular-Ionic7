import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Auth, getAuth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth;

  constructor(afApp: FirebaseApp) {
    // Obtenemos el objeto auth de firebase
    this.auth = getAuth(afApp);
  }

  getAuth(){
    return this.auth;
  }

  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  logout() {
    return signOut(this.auth);
  }

}
