import {RegistrationRequest} from "./registrationRequest";
import {Place} from "../location/place";
import {UserFavoriteActivity} from "./userFavoriteActivity";

export class ParticipantRegistrarionRequest extends RegistrationRequest {
  place: Place | null = null;
  favoritesActivities: UserFavoriteActivity[] = [];
}
