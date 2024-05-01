import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {Observable} from "rxjs";
import {CreateEventRequest} from "../../models/event/createEventRequest";
import {EventDto} from "../../models/event/eventDto";
import {EventsResumesPage} from "../../models/event/EventsResumesPage";
import {EventWithParticipantReputationDto} from "../../models/event/eventWithParticipantReputationDto";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/events";
  private _lastCreatedEvent: EventDto | null = null;

  constructor() { }

  set lastCreatedEvent(value: EventDto | null) {
    this._lastCreatedEvent = value;
  }
  get lastCreatedEvent(): EventDto | null {
    const event = this._lastCreatedEvent;
    this._lastCreatedEvent = null;
    return event;
  }

  createEvent(request: CreateEventRequest): Observable<EventDto> {
    return this.httpClient.post<EventDto>(this.baseUrl + "/create/", request);
  }

  findEvents(activity: string | undefined, neighborhood: string | undefined, locality: string | undefined,
             adminSubdistrict: string | undefined, adminDistrict: string | undefined, dateFrom: string | null,
             dateTo: string | null,
             hours: string[], limit: number, page: number): Observable<EventsResumesPage> {
    let baseParams: HttpParams = new HttpParams();

    if(activity)
     baseParams = baseParams.append('activity', activity);

    if(neighborhood)
      baseParams = baseParams.append('neighborhood', neighborhood);

    if(locality)
      baseParams = baseParams.append('locality', locality);

    if(adminSubdistrict)
      baseParams = baseParams.append('adminSubdistrict', adminSubdistrict);

    if(adminDistrict)
      baseParams = baseParams.append('adminDistrict', adminDistrict);

    if(dateFrom)
      baseParams = baseParams.append('dateFrom', dateFrom);

    if(dateTo)
      baseParams = baseParams.append('dateTo', dateTo)

    if(hours.length > 0)
      baseParams = baseParams.append('hours', hours.join(','));

    baseParams = baseParams.append('limit', limit);
    baseParams = baseParams.append('page', page)

    return this.httpClient.get<EventsResumesPage>(this.baseUrl + "/find/", {
      params: baseParams});
  }

  findEventById(eventId: string): Observable<EventWithParticipantReputationDto> {
    return this.httpClient.get<EventWithParticipantReputationDto>(this.baseUrl + "/find/" + eventId);
  }
}
