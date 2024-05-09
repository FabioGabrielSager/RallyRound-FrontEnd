import {EventInscriptionStatus} from "./eventInscriptionStatus";
import {EventWithCreatorReputation} from "./eventWithCreatorReputation";

export interface EventWithCreatorReputationAndInscriptionStatusDto extends EventWithCreatorReputation {
  eventInscriptionStatus: EventInscriptionStatus
}
