import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {Observable} from "rxjs";
import {CreateEventRequest} from "../../models/event/createEventRequest";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/events";

  constructor() { }

  createEvent(request: CreateEventRequest): Observable<CreateEventRequest> {
    return this.httpClient.post<CreateEventRequest>(this.baseUrl + "/create/", request);
  }
}
