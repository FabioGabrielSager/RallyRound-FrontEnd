import {PagedResponse} from "../../../common/pagedResponse";
import {ReportResponse} from "./reportResponse";

export interface ParticipantReportsPage extends PagedResponse {
  reports: ReportResponse[];
}
