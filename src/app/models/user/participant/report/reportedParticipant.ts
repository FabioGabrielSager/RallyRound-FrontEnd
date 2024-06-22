import {ParticipantResume} from "../participantResume";

export interface ReportedParticipant {
  asParticipantReportsCount: number;
  asEventCreatorReportsCount: number;
  participant: ParticipantResume;
}
