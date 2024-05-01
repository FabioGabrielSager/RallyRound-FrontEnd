import {CreateEventRequest} from "./createEventRequest";
import {EventParticipant} from "./eventParticipant";

export interface EventDto {
  eventId: string;
  event: CreateEventRequest;
  eventParticipants: EventParticipant[];
}
