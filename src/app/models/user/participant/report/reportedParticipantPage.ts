import {PagedResponse} from "../../../common/pagedResponse";
import {ReportedParticipant} from "./reportedParticipant";

export interface ReportedParticipantPage extends PagedResponse {
  reportedParticipants: ReportedParticipant[];
}
