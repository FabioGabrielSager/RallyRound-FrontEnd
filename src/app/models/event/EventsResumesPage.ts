import {EventResumeDto} from "./eventResumeDto";

export interface EventsResumesPage {
  page: number;
  pageSize: number;
  totalElements: number;
  results: EventResumeDto[];
}
