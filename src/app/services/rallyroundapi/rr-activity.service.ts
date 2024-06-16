import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {MatchedActivities} from "../../models/common/MatchedActivities";
import {Observable} from "rxjs";
import {environment} from "../../../enviroment/enviroment";
import {EventsForActivityByMonth} from "../../models/event/eventsForActivityByMonth";

@Injectable({
  providedIn: 'root'
})
export class RrActivityService {
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/activities";
  constructor() { }

  getMatchedActivities(name: String): Observable<MatchedActivities> {
    return this.httpClient.get<MatchedActivities>(this.baseUrl + "/matches/" + name)
  }

  getEventsForActivityByMonth(month: number, inscriptionFeeType: string): Observable<EventsForActivityByMonth> {
    let baseParams = new HttpParams();

    if(month) {
      baseParams = baseParams.append("month", month);
    }

    if(inscriptionFeeType && inscriptionFeeType != "both") {
      baseParams = baseParams.append("inscriptionFeeType", inscriptionFeeType);
    }

    return this.httpClient.get<EventsForActivityByMonth>(this.baseUrl + "/event-counts", {params: baseParams});
  }
}
