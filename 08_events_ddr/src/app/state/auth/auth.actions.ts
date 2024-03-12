export class CheckIsLogged {
  static readonly type = '[Auth] Check is logged';
}

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { email: string, password: string }) { }
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

