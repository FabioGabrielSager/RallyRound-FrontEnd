import {ReportRequest} from "./reportRequest";

export interface ReportResponse extends ReportRequest {
  reportNumber: number;
  reportDateTime: string;
  id: string;
}
