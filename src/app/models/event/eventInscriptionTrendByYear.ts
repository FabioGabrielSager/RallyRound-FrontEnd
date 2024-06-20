import {EventInscriptionTrendByMonth} from "./eventInscriptionTrendByMonth";

export interface EventInscriptionTrendByYear {
  year: number;
  trends: EventInscriptionTrendByMonth[];
}
