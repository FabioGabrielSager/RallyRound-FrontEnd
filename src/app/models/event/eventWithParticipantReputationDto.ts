import {EventDto} from "./eventDto";

export interface EventWithParticipantReputationDto extends EventDto {
  eventCreatorReputation: string
}
