import { User } from "src/app/models/user";

export class GetUser {
  static readonly type = '[Users] Get User';
  constructor(public payload: { email: string }) { }
}

export class CreateUser {
  static readonly type = '[Users] Create User';
  constructor(public payload: { user: User }) { }
}
