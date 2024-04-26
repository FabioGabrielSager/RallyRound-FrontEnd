export class ConfirmParticipantRegistrationRequest {
  private code: number;
  private email: string;

  constructor(code: number, userId: string) {
    this.code = code;
    this.email = userId;
  }
}
