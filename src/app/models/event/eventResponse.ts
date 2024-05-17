import {EventParticipant} from "./eventParticipant";
import {AddressEntity} from "../location/AddressEntity";
import {EventState} from "./eventState";

export interface EventResponse {
  id: string;
  activity: string;
  description: string;
  eventSchedules: string;
  duration: string;
  durationUnit: string;
  inscriptionPrice: number;
  date: string;
  address: AddressEntity;
  participantsLimit: number;
  eventCreatorIsParticipant: boolean;
  eventCreatorReputation: string;
  state: EventState;
  startingHours: string[];
  startingHoursTimesVoted?: Map<string, number>;
  eventParticipants: EventParticipant[];
}
