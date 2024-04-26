import {CreateEventRequest} from "./createEventRequest";
import {EventParticipant} from "./eventParticipant";

export interface CreatedEventResponse {
  eventId: string;
  event: CreateEventRequest;
  eventParticipants: EventParticipant[];
}
