import {EventDurationUnit} from "./eventDurationUnit";
import {AddressEntity} from "../location/AddressEntity";

export class CreateEventRequest {
  activity: string = "";
  description: string = "";
  startingHours: string[] = [];
  duration: number = 0;
  durationUnit: EventDurationUnit = EventDurationUnit.HOUR;
  inscriptionPrice: number = 0;
  date: string = "";
  address: AddressEntity = {} as AddressEntity;
  participantsLimit: number = 0
  eventCreatorIsParticipant: boolean = false;
  eventCreatorSelectedStartHour: string | undefined = undefined;
}
