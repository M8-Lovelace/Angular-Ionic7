export class SendNotification {
  static readonly type = '[Notifications] Send notification';
  constructor(public payload: { title: string, body: string }) { }
}
