import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {Observable} from "rxjs";
import {CreateEventInscriptionResponse} from "../../models/event/createEventInscriptionResponse";
import {EventInscriptionResponse} from "../../models/event/EventInscriptionResponse";
import {UserPublicDataDto} from "../../models/user/participant/userPublicDataDto";
import {ReportRequest} from "../../models/user/participant/report/reportRequest";
import {ReportResponse} from "../../models/user/participant/report/reportResponse";

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {

  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/participant";

  constructor() { }

  createEventInscription(eventId: string): Observable<CreateEventInscriptionResponse> {
    return this.httpClient.post<CreateEventInscriptionResponse>(
      `${this.baseUrl}/events/${eventId}/inscriptions/create`, {});
  }

  completeEventInscription(eventId: string, selectedHour: string): Observable<EventInscriptionResponse> {
    return this.httpClient.put<EventInscriptionResponse>(
      `${this.baseUrl}/events/${eventId}/inscriptions/complete/${selectedHour}`, {});
  }

  getUserData(userId: string): Observable<UserPublicDataDto> {
    return this.httpClient.get<UserPublicDataDto>(this.baseUrl + "/public/" + userId);
  }

  sendUserReport(reportRequest: ReportRequest): Observable<ReportResponse> {
    return this.httpClient.post<ReportResponse>(this.baseUrl + "/report/", reportRequest);
  }
}
