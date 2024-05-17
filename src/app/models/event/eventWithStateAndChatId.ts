import {CreateEventRequest} from "./createEventRequest";
import {EventState} from "./eventState";

export class EventWithStateAndChatId extends CreateEventRequest{
  state!: EventState;
  chatId!: string;
}
