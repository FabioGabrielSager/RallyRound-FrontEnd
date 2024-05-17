import {EventResponseForParticipants} from "./eventResponseForParticipants";

export interface CachedEvent {
  isEventCreatedByCurrentUser: boolean | undefined,
  event: EventResponseForParticipants | null
}
