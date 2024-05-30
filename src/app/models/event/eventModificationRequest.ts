import {CreateEventRequest} from "./createEventRequest";
import {AddressEntity} from "../location/AddressEntity";
import {EventDurationUnit} from "./eventDurationUnit";

export interface EventModificationRequest {
  eventId: string;
  activity: string;
  description: string;
  startingHours: string[] | null;
  duration: number | undefined  ;
  durationUnit: EventDurationUnit | undefined;
  inscriptionPrice: number | undefined;
  date: string;
  address: AddressEntity | null;
  participantsLimit: number | undefined;
  eventCreatorIsParticipant: boolean;
  eventCreatorSelectedStartHour: string;
}
