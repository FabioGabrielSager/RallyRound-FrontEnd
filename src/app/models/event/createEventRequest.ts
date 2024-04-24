import {EventDurationUnit} from "./eventDurationUnit";
import {Address} from "../location/address";
import {AddressEntity} from "../location/AddressEntity";

export class CreateEventRequest {
  activity: string = "";
  description: string = "";
  startHours: string[] = [];
  duration: number = 0;
  durationUnit: EventDurationUnit = EventDurationUnit.HOUR;
  inscriptionPrice: number = 0;
  date: string = "";
  address: AddressEntity = {} as AddressEntity;
}
