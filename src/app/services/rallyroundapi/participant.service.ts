import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {EventInscriptionStatus} from "../../models/event/eventInscriptionStatus";
import {MPPaymentStatus} from "../../models/MPPaymentStatus";
import {Observable} from "rxjs";
import {EventsResumesPage} from "../../models/event/EventsResumesPage";
import {CreateEventInscriptionResponse} from "../../models/event/createEventInscriptionResponse";
import {EventInscriptionResponse} from "../../models/event/EventInscriptionResponse";
import {
  EventWithCreatorReputationAndInscriptionStatusDto
} from "../../models/event/eventWithCreatorReputationAndInscriptionStatusDto";

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/participant";

  constructor() { }

  // Retrieves the events which the user is participant
  getMyEvents(createdAt: Date | null, status: EventInscriptionStatus | null,
              paymentStatus: MPPaymentStatus | null, activity: string | undefined, neighborhood: string | undefined,
              locality: string | undefined, adminSubdistrict: string | undefined, adminDistrict: string | undefined,
              dateFrom: string | null, dateTo: string | null, hours: string[]):
    Observable<EventsResumesPage> {
    let baseParams: HttpParams = new HttpParams();

    if(createdAt)
      baseParams.append("createdAt", createdAt.toISOString());

    if(status)
      baseParams.append("status", status);

    if(paymentStatus)
      baseParams.append("paymentStatus", paymentStatus);

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

    return this.httpClient.get<EventsResumesPage>(`${this.baseUrl}/events/singedup`,
      { params: baseParams });
  }

  getMyCreatedEvents(activity: string | undefined, neighborhood: string | undefined, locality: string | undefined,
                     adminSubdistrict: string | undefined, adminDistrict: string | undefined, dateFrom: string | null,
                     dateTo: string | null, hours: string[]): Observable<EventsResumesPage> {
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

    return this.httpClient.get<EventsResumesPage>(`${this.baseUrl}/events/created`, { params: baseParams });
  }

  createEventInscription(eventId: string): Observable<CreateEventInscriptionResponse> {
    return this.httpClient.post<CreateEventInscriptionResponse>(
      `${this.baseUrl}/events/${eventId}/inscriptions/create`, {});
  }

  completeEventInscription(eventId: string, selectedHour: string): Observable<EventInscriptionResponse> {
    return this.httpClient.put<EventInscriptionResponse>(
      `${this.baseUrl}/events/${eventId}/inscriptions/complete/${selectedHour}`, {});
  }

  findParticipantSingedUpEvent(eventId: string):
    Observable<EventWithCreatorReputationAndInscriptionStatusDto> {
    return this.httpClient
      .get<EventWithCreatorReputationAndInscriptionStatusDto>(`${this.baseUrl}/events/${eventId}/enrolled/`);
  }
}
