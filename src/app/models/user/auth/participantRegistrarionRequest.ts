import {RegistrationRequest} from "./registrationRequest";
import {Place} from "../../location/place";
import {UserFavoriteActivity} from "../participant/userFavoriteActivity";

export class ParticipantRegistrarionRequest extends RegistrationRequest {
  hasAcceptedTermsAndConditions: boolean = false;
  place: Place | null = null;
  favoritesActivities: UserFavoriteActivity[] = [];
}
