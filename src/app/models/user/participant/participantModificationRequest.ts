import {Place} from "../../location/place";
import {UserPublicDataDto} from "./userPublicDataDto";

export interface ParticipantModificationRequest extends UserPublicDataDto {
  lastName: string | undefined;
  email: string | undefined;
  place: Place | null;
  birthdate: string | undefined;
}
