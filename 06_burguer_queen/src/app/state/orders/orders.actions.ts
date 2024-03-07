import { Order } from "src/app/models/order";

export class CreateOrder {
  static readonly type = '[Orders] Create order';
  constructor(public payload: { order: Order }) { }
}
