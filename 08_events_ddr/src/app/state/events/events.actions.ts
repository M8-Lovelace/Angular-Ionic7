import { EventDDR } from "src/app/models/event.ddr";


export class GetFutureEvents {
  static readonly type = '[Events] Get future events';
}

export class CreateEvent {
  static readonly type = '[Events] Create event';
  constructor(public payload: { event: EventDDR }) { }
}

export class UpdateEvent {
  static readonly type = '[Events] Update event';
  constructor(public payload: { event: EventDDR }) { }
}

export class DeleteEvent {
  static readonly type = '[Events] Delete event';
  constructor(public payload: { id: string }) { }
}

