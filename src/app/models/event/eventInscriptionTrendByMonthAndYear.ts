import {EventInscriptionTrendByEvent} from "./eventInscriptionTrendByEvent";

export interface EventInscriptionTrendByMonthAndYear {
  month: number;
  year: number;
  results: EventInscriptionTrendByEvent[];
}
