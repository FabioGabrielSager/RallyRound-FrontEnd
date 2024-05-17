import {ParticipantResume} from "../user/participant/participantResume";

export interface ChatMessage {
  id: string,
  message: string,
  sender: ParticipantResume,
  submittedByRequester: boolean,
  timestamp: number
}
