import {EventDurationUnit} from "./eventDurationUnit";
import {AddressEntity} from "../location/AddressEntity";

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
  participantsCount: number
}
