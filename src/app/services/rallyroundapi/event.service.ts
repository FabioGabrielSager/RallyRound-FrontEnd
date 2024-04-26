import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {Observable} from "rxjs";
import {CreateEventRequest} from "../../models/event/createEventRequest";
import {CreatedEventResponse} from "../../models/event/createdEventDto";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/events";
  private _lastCreatedEvent: CreatedEventResponse | null = null;

  constructor() { }

  set lastCreatedEvent(value: CreatedEventResponse | null) {
    this._lastCreatedEvent = value;
  }
  get lastCreatedEvent(): CreatedEventResponse | null {
    const event = this._lastCreatedEvent;
    this._lastCreatedEvent = null;
    return event;
  }

  createEvent(request: CreateEventRequest): Observable<CreatedEventResponse> {
    return this.httpClient.post<CreatedEventResponse>(this.baseUrl + "/create/", request);
  }
}
