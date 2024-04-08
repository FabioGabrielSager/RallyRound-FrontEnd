import {inject, Injectable} from '@angular/core';
import {ParticipantRegistrarionRequest} from "../../models/user/participantRegistrarionRequest";
import {UserFavoriteActivity} from "../../models/user/userFavoriteActivity";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {map, Observable, tap} from "rxjs";
import {ParticipantRegistrationResponse} from "../../models/user/participantRegistrationResponse";
import {AuthResponse} from "../../models/user/AuthResponse";
import {ConfirmParticipantRegistrationRequest} from "../../models/user/confirmParticipantRegistrationRequest";
import {LoginRequest} from "../../models/user/loginRequest";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private participantRegistrationRequest: ParticipantRegistrarionRequest = new ParticipantRegistrarionRequest();
  private profilePhoto: File | null = null;
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/auth";

  constructor() {
  }

  setParticipantRegistrationRequestData(data: ParticipantRegistrarionRequest) {
    this.participantRegistrationRequest = data;
  }

  setParticipantRegistrationRequestPhoto(photo: File) {
    this.profilePhoto = photo;
  }

  setParticipantRegistrationRequestActivities(activities: UserFavoriteActivity[]) {
    this.participantRegistrationRequest.favoritesActivities = activities;
  }

  sendRegistrationRequest(): Observable<ParticipantRegistrationResponse> {
    const formData = new FormData();
    formData.append('participantData', JSON.stringify(this.participantRegistrationRequest));
    if(this.profilePhoto)
      formData.append('profilePhoto', this.profilePhoto);

    return this.httpClient.post<ParticipantRegistrationResponse>(
      this.baseUrl + "/participant/register",
      formData
    );
  }

  sendRegistrationConfirmation(userId: string, verificationCode: number): Observable<null> {
    let request: ConfirmParticipantRegistrationRequest =
      new ConfirmParticipantRegistrationRequest(verificationCode, userId);
    return this.httpClient.post<AuthResponse>(this.baseUrl + "/participant/confirm/email", request).pipe(
      tap(authResponse => sessionStorage.setItem("token", authResponse.token)),
      map(_ => null)
    );
  }

  refreshEmailVerificationToken(userId: string) {
    return this.httpClient.put(this.baseUrl + "/participant/email/token/refresh", {}, {
      params: {userId: userId}
    }).pipe(
      map(_ => null)
    );
  }

  login(loginRequest: LoginRequest): Observable<null> {
    return this.httpClient.post<AuthResponse>(this.baseUrl + "/participant/login", loginRequest).pipe(
      tap(authResponse => sessionStorage.setItem("token", authResponse.token)),
      map(_ => null)
    );
  }
}
