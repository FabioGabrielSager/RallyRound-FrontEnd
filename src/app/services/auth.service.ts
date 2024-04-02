import { Injectable } from '@angular/core';
import {ParticipantRegistrarionRequest} from "../models/user/participantRegistrarionRequest";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private participantRegistrationRequest: ParticipantRegistrarionRequest = new ParticipantRegistrarionRequest();
  constructor() { }

  setParticipantRegistrationRequestData(data: ParticipantRegistrarionRequest) {
    this.participantRegistrationRequest = data;
  }

  setParticipantRegistrationRequestPhoto(photo: File) {
    this.participantRegistrationRequest.profilePhoto = photo;
  }
}
