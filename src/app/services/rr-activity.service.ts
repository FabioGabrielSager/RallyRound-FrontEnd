import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MatchedActivities} from "../models/common/MatchedActivities";
import {Observable} from "rxjs";
import {environment} from "../../enviroment/enviroment";

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
}
