import {EventParticipant} from "./eventParticipant";
import {AddressEntity} from "../location/AddressEntity";
import {EventState} from "./eventState";
import {ParticipantReputation} from "../user/participant/reputation/participantReputation";

export interface EventResponse {
  id: string;
  activity: string;
  description: string;
  eventSchedules: string;
  duration: number;
  durationUnit: string;
  inscriptionPrice: number;
  date: string;
  address: AddressEntity;
  participantsLimit: number;
  eventCreatorIsParticipant: boolean;
  eventCreatorReputation: ParticipantReputation;
  state: EventState;
  startingHours: string[];
  startingHoursTimesVoted: Map<string, number>;
  eventParticipants: EventParticipant[];
}
