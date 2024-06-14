import {ParticipantResume} from "./participantResume";

export interface SearchedParticipantResult {
  totalMatches: number,
  limit: number,
  page: number,
  matches: ParticipantResume[]
}
