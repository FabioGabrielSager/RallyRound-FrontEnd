import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {Observable} from "rxjs";
import {CreateEventInscriptionResponse} from "../../models/event/createEventInscriptionResponse";
import {EventInscriptionResponse} from "../../models/event/EventInscriptionResponse";
import {UserPublicDataDto} from "../../models/user/participant/userPublicDataDto";
import {ReportRequest} from "../../models/user/participant/report/reportRequest";
import {ReportResponse} from "../../models/user/participant/report/reportResponse";
import {ParticipantPersonalDataDto} from "../../models/user/participant/participantPersonalDataDto";
import {ParticipantModificationRequest} from "../../models/user/participant/participantModificationRequest";

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

  getUserPersonalData(): Observable<ParticipantPersonalDataDto> {
    return this.httpClient.get<ParticipantPersonalDataDto>(this.baseUrl + "/personal/")
  }

  sendUserReport(reportRequest: ReportRequest): Observable<ReportResponse> {
    return this.httpClient.post<ReportResponse>(this.baseUrl + "/report/", reportRequest);
  }

  modifyUserAccount(request: ParticipantModificationRequest | null, newProfilePhoto: File | null) {
    const formData = new FormData();

    let personalInfo = request;
    if(personalInfo == null) {
      personalInfo = {} as ParticipantPersonalDataDto;
    }

    formData.append('participantData', JSON.stringify(personalInfo));
    if(newProfilePhoto != null) {
      formData.append('profilePhoto', newProfilePhoto);
    }

    return this.httpClient.put<ParticipantPersonalDataDto>(this.baseUrl + "/modify/", formData);
  }
}
