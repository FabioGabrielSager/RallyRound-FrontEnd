export class ConfirmParticipantRegistrationRequest {
  private code: number;
  private userId: string;

  constructor(code: number, userId: string) {
    this.code = code;
    this.userId = userId;
  }
}
