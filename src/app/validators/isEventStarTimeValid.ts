import {environment} from "../../enviroment/enviroment";

export function isEventStarTimeValid(eventStartDateString: string, eventStartTime: string): boolean {
  const MIN_EVENT_ADVANCE_HOURS: number = environment.MIN_EVENT_ADVANCE_HOUR;
  const todayDate = new Date();
  const eventStartDate = new Date(eventStartDateString);
  eventStartDate.setDate(eventStartDate.getDate() + 1);

  if(eventStartDate.getDate() > todayDate.getDate() && eventStartDate.getMonth() >= todayDate.getMonth()
    && eventStartDate.getFullYear() >= todayDate.getFullYear()) {
    return true;
  }

  const eventStartHour = Number(eventStartTime.split(":")[0]);
  const eventStartMinutes = Number(eventStartTime.split(":")[1]);

  let minAcceptedStartDateTime: Date = new Date();
  minAcceptedStartDateTime.setHours(todayDate.getHours() + todayDate.getMinutes() / 60 + MIN_EVENT_ADVANCE_HOURS);
  minAcceptedStartDateTime.setSeconds(0);

  let eventStartDateTime = new Date(eventStartDate);
  eventStartDateTime.setHours(eventStartHour, eventStartMinutes);

  return eventStartDateTime >= minAcceptedStartDateTime;
}
