export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { email: string, password: string }) { }
}
