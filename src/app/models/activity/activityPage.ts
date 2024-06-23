import {PagedResponse} from "../common/pagedResponse";
import {Activity} from "./activity";

export interface ActivityPage extends PagedResponse {
  activities: Activity[];
}
