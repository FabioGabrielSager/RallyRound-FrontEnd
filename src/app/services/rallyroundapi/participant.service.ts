import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {map, Observable, tap} from "rxjs";
import {CreateEventInscriptionResponse} from "../../models/event/createEventInscriptionResponse";
import {EventInscriptionResponse} from "../../models/event/EventInscriptionResponse";
import {UserPublicDataDto} from "../../models/user/participant/userPublicDataDto";
import {ReportRequest} from "../../models/user/participant/report/reportRequest";
import {ReportResponse} from "../../models/user/participant/report/reportResponse";
import {ParticipantPersonalDataDto} from "../../models/user/participant/participantPersonalDataDto";
import {ParticipantModificationRequest} from "../../models/user/participant/participantModificationRequest";
import {SearchedParticipantResult} from "../../models/user/participant/searchedParticipantResult";

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

  retrieveEventInscriptionPaymentLink(eventId: string): Observable<string> {
    return this.httpClient.get<{ link:string }>(`${this.baseUrl}/events/${eventId}/inscriptions/paymentlink`)
      .pipe(
        map((payment: { link:string }) => payment.link)
      );
  }

  cancelEventInscription(eventId: string) {
    return this.httpClient.delete(`${this.baseUrl}/events/${eventId}/inscriptions/cancel`);
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

  deleteUserAccount(password: string): Observable<any> {
    return this.httpClient.delete(this.baseUrl + "/delete/", {params: { "password": password }})
      .pipe(
        tap(() => sessionStorage.removeItem("token"))
      );
  }

  leaveEvent(eventId: string){
    return this.httpClient.delete(this.baseUrl + `/events/${eventId}/leave/`);
  }

  searchParticipant(query: string): Observable<SearchedParticipantResult> {
    return this.httpClient.get<SearchedParticipantResult>(this.baseUrl + "/search/" + query);
  }

  inviteParticipantToEvent(eventId: string, participantId: string) {
    return this.httpClient.post(`${this.baseUrl}/event/${eventId}/created/invite/${participantId}`, {});
  }
}
