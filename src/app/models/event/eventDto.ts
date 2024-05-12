import {EventParticipant} from "./eventParticipant";
import {EventWithState} from "./eventWithState";

export interface EventDto {
  eventId: string;
  event: EventWithState;
  eventParticipants: EventParticipant[];
}
