import {EventInscriptionStatus} from "./eventInscriptionStatus";

export interface EventInscriptionResponse {
  eventId: string,
  inscriptionStatus: EventInscriptionStatus,
}
