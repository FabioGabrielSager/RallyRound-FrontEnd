import {ReportMotive} from "./reportMotive";

export interface ReportRequest {
  reportedUserId: string;
  reportMotive: ReportMotive;
  description: string;
  asEventCreator: boolean;
}
