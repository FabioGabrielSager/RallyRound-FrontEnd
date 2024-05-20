import {UserPublicDataDto} from "./userPublicDataDto";
import {Place} from "../../location/place";

export interface ParticipantPersonalDataDto extends UserPublicDataDto {
  lastName: string;
  email: string;
  place: Place;
  birthdate: string;
}
