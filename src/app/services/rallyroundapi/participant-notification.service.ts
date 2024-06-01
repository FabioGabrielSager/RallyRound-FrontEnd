import {inject, Injectable} from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {RxStompService} from "../rxstomp/rx-stomp.service";
import {Observable} from "rxjs";
import {
  ParticipantEventNotificationDto
} from "../../models/user/participant/notification/participantEventNotificationDto";
import {IMessage} from "@stomp/rx-stomp";

@Injectable({
  providedIn: 'root'
})
export class ParticipantNotificationService {
  private authService: AuthService = inject(AuthService);
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/participant/notifications/";
  private rxStomp: RxStompService = inject(RxStompService);

  constructor() {
    this.rxStomp.configure({
      brokerURL: "ws://localhost:8080/notification",
      connectHeaders: {
        'Authorization': `Bearer ${this.authService.currentUserLoginOnToken.value}`
      }
    });
  }

  getCurrentUserNotifications(): Observable<ParticipantEventNotificationDto[]> {
    return this.httpClient.get<ParticipantEventNotificationDto[]>(this.baseUrl);
  }

  markNotificationAsViewed(notificationId: string): Observable<ParticipantEventNotificationDto> {
    return this.httpClient
      .patch<ParticipantEventNotificationDto>(this.baseUrl + `${notificationId}/viewed`, {})
  }

  connectToCurrentUserNotificationTray(): Observable<IMessage> {
    this.rxStomp.activate();
    return this.rxStomp.watch(
      `/user/${this.authService.currentUserLoginOnNotificationTrayId.value}/queue/notification`
    );
  }

  disconnectFromTheNotificationTray() {
    this.rxStomp.deactivate();
  }
}
