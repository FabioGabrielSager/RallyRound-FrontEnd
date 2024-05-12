import {CreateEventRequest} from "./createEventRequest";
import {EventState} from "./eventState";

export class EventWithState extends CreateEventRequest{
  state!: EventState;
}
