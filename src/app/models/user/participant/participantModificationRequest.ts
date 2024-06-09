import {Place} from "../../location/place";
import {UserPublicDataDto} from "./userPublicDataDto";

export interface ParticipantModificationRequest extends UserPublicDataDto {
  email: string | undefined;
  place: Place | null;
  birthdate: string | undefined;
}
