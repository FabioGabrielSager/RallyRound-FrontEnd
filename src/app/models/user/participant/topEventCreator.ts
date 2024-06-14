import {ParticipantResume} from "./participantResume";

export interface TopEventCreator {
  eventCreator: ParticipantResume;
  finalizedEventsCount: number;
}
