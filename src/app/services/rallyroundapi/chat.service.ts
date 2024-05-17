import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {Observable} from "rxjs";
import {ChatMessages} from "../../models/chat/chatMessages";
import {MessageDto} from "../../models/chat/messageDto";
import {AuthService} from "../auth/auth.service";
import {RxStompService} from "../rxstomp/rx-stomp.service";
import {IMessage} from "@stomp/rx-stomp";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private authService: AuthService = inject(AuthService);
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/chats";
  private rxStomp: RxStompService = inject(RxStompService);

  constructor() {
    this.rxStomp.configure({
      brokerURL: "ws://localhost:8080/chat",
      connectHeaders: {
        'Authorization': `Bearer ${this.authService.currentUserLoginOnToken.value}`
      }
    });
  }

  getChatMessages(chatId: string): Observable<ChatMessages> {
    return this.httpClient.get<ChatMessages>(this.baseUrl + "/" + chatId);
  }

  connectToEventChat(chatId: string): Observable<IMessage> {
    this.rxStomp.activate();
    return this.rxStomp.watch(`/topic/event/${chatId.trim()}`);
  }

  disconnectFromTheCurrentChat() {
    this.rxStomp.deactivate();
  }

  sendMessage(message: MessageDto): Observable<MessageDto> {
    return this.httpClient.post<MessageDto>(`${this.baseUrl}/message/`, message);
  }
}
