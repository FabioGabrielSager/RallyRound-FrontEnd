import {RegistrationRequest} from "./registrationRequest";
import {Place} from "../location/place";
import {UserFavoriteActivity} from "./userFavoriteActivity";

export class ParticipantRegistrarionRequest extends RegistrationRequest {
  place: Place | null = null;
  profilePhoto: File | null = null;
  favoritesActivities: UserFavoriteActivity[] | null = null;
}
