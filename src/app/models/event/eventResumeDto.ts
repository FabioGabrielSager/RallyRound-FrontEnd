import {EventDurationUnit} from "./eventDurationUnit";
import {AddressEntity} from "../location/AddressEntity";
import {EventInscriptionStatus} from "./eventInscriptionStatus";
import {EventState} from "./eventState";

export interface EventResumeDto {
  eventId: string,
  activity: string,
  startingHours: string[],
  duration: number,
  durationUnit: EventDurationUnit,
  inscriptionPrice: number,
  date: string,
  address: AddressEntity,
  participantsLimit: number,
  participantsCount: number,
  inscriptionStatus: EventInscriptionStatus | null,
  state: EventState
}
