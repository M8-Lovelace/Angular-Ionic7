import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { TokenUser } from 'src/app/models/token-user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  login(email: string, password: string){
    return CapacitorHttp.post({
      url: environment.urlApi + 'auth/login',
      data: {
        email,
        password
      },
      params: {},
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( (response: HttpResponse) => {
      if(response.status == 201){
        const data = response.data as TokenUser;
        return data;
      }
      return null;
    }).catch( err => {
      console.error(err);
      return null;
    })
  }


}
