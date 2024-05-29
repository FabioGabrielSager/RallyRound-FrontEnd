import {inject, Injectable} from '@angular/core';
import {ParticipantRegistrarionRequest} from "../../models/user/auth/participantRegistrarionRequest";
import {UserFavoriteActivity} from "../../models/user/participant/userFavoriteActivity";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {BehaviorSubject, catchError, map, Observable, of, tap} from "rxjs";
import {ParticipantRegistrationResponse} from "../../models/user/auth/participantRegistrationResponse";
import {AuthResponse} from "../../models/user/auth/AuthResponse";
import {ConfirmParticipantRegistrationRequest} from "../../models/user/auth/confirmParticipantRegistrationRequest";
import {LoginRequest} from "../../models/user/auth/loginRequest";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private participantRegistrationRequest: ParticipantRegistrarionRequest = new ParticipantRegistrarionRequest();
  private profilePhoto: File | null = null;
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/auth";
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserLoginOnToken: BehaviorSubject<string> = new BehaviorSubject<string>("");
  currentUserLoginOnPrivileges: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() {
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null);
    this.currentUserLoginOnToken=new BehaviorSubject<string>(sessionStorage.getItem("token") || "");
    this.currentUserLoginOnPrivileges=
      new BehaviorSubject<string[]>(JSON.parse(sessionStorage.getItem("privileges") || "[]"));
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

  sendRegistrationConfirmation(userEmail: string, verificationCode: number): Observable<String> {
    let request: ConfirmParticipantRegistrationRequest =
      new ConfirmParticipantRegistrationRequest(verificationCode, userEmail);
    return this.httpClient.post<AuthResponse>(this.baseUrl + "/participant/confirm/email", request).pipe(
      tap(authResponse => {
        sessionStorage.setItem("token", authResponse.token);
        this.currentUserLoginOnToken.next(authResponse.token);
        this.currentUserLoginOn.next(true);
      }),
      map(authResponse => authResponse.username)
    );
  }

  refreshEmailVerificationToken(userEmail: string) {
    return this.httpClient.put<void>(this.baseUrl + "/participant/refresh/registration/token/", {}, {
      params: {userEmail: userEmail}
    });
  }

  login(loginRequest: LoginRequest): Observable<{ username: string, roles: string[] }> {
    sessionStorage.removeItem("token");
    this.currentUserLoginOnToken.next("");
    return this.httpClient.post<AuthResponse>(this.baseUrl + "/login", loginRequest).pipe(
      tap(authResponse => {
        sessionStorage.setItem("token", authResponse.token);
        sessionStorage.setItem("privileges", JSON.stringify(authResponse.privileges));
        this.currentUserLoginOnToken.next(authResponse.token);
        this.currentUserLoginOnPrivileges.next(authResponse.privileges);
        this.currentUserLoginOn.next(true);
      }),
      map(authResponse => { return {username: authResponse.username, roles: authResponse.userRoles} })
    );
  }

  logout(): void {
    sessionStorage.removeItem("token");
    this.currentUserLoginOn.next(false);
  }

  validateUserToken(): Observable<boolean> {
    return this.httpClient.get<boolean>(this.baseUrl + "/participant/validate/jwt")
      .pipe(
        catchError((err) => {
          console.log(err)
          return of(false)
        })
      );
  }
}
