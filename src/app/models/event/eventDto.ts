import {EventParticipant} from "./eventParticipant";
import {EventWithStateAndChatId} from "./eventWithStateAndChatId";

export interface EventDto {
  eventId: string;
  event: EventWithStateAndChatId;
  eventParticipants: EventParticipant[];
}
