import {EventResponse} from "./eventResponse";

export interface EventResponseForEventCreators extends EventResponse {
  selectedStartingHour: string,
  chatId: string
}
