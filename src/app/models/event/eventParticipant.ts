import {ParticipantResume} from "../user/participant/participantResume";

export interface EventParticipant {
  participant: ParticipantResume;
  eventCreator: boolean;
}
