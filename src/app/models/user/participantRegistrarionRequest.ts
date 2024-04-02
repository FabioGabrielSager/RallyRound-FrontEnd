import {RegistrationRequest} from "./registrationRequest";
import {Place} from "../location/place";

export class ParticipantRegistrarionRequest extends RegistrationRequest {
  place: Place | null = null;
  profilePhoto: File | null = null;
}
