import {ReportMotive} from "../report/reportMotive";
import {ParticipantReputation} from "./participantReputation";

export const ParticipantReputationMessages: { [key in ParticipantReputation]: string } = {
  [ParticipantReputation.GOOD]: "Buena",
  [ParticipantReputation.INTERMEDIATE]: "Intermedia",
  [ParticipantReputation.BAD]: "Mala"
}
