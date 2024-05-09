import {EventDto} from "./eventDto";
import {EventInscriptionStatus} from "./eventInscriptionStatus";

export interface EventWithCreatorReputation extends EventDto {
  eventCreatorReputation: string
}
