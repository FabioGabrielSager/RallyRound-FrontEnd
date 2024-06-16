import {EventsCount} from "./EventsCount";

export interface EventsFeeSummary {
  dateFrom: string;
  dateTo: string;
  paidEventsCount: EventsCount;
  unpaidEventsCount: EventsCount;
}
