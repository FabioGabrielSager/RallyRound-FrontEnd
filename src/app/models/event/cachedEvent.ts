import {EventWithCreatorReputationAndInscriptionStatusDto} from "./eventWithCreatorReputationAndInscriptionStatusDto";

export interface CachedEvent {
  isEventCreatedByCurrentUser: boolean | undefined,
  event: EventWithCreatorReputationAndInscriptionStatusDto | null
}
