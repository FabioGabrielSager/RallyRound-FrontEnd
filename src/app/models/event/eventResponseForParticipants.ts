import {EventResponseForEventCreators} from "./eventResponseForEventCreators";
import {EventInscriptionStatus} from "./eventInscriptionStatus";

export interface EventResponseForParticipants extends EventResponseForEventCreators {
  eventInscriptionStatus: EventInscriptionStatus
}
