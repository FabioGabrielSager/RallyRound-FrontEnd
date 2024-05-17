import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatMessages} from "../../../models/chat/chatMessages";
import {DatePipe} from "@angular/common";
import {ChatMessage} from "../../../models/chat/chatMessage";
import {v4 as uuidv4} from 'uuid';
import {FormsModule} from "@angular/forms";
import {ChatService} from "../../../services/rallyroundapi/chat.service";
import {MessageDto} from "../../../models/chat/messageDto";
import {Subscription} from "rxjs";
import {ToastService} from "../../../services/toast.service";
import {IMessage} from "@stomp/rx-stomp";

@Component({
  selector: 'rr-chat',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  chat: ChatMessages = { chatId: "", messages: [] } as ChatMessages;
  @Input() chatId: string = "";
  messageToSend: string = "";
  private lastSentMessageId: string = "";
  private toastService: ToastService = inject(ToastService);
  private chatService: ChatService = inject(ChatService);
  private subs: Subscription = new Subscription();
  isChatLoaded: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    if(this.chatId !== "") {
      this.subs.add(
        this.chatService.getChatMessages(this.chatId).subscribe({
          next: chat => {
            this.chat = chat;
            this.isChatLoaded = true;
            this.chatService.connectToEventChat(this.chatId).subscribe({
                next: (message: IMessage) => {
                  const chatMessage: ChatMessage = JSON.parse(message.body);
                  chatMessage.submittedByRequester = this.lastSentMessageId === chatMessage.id;
                  this.chat.messages.push(chatMessage);
                }
              }
            );
          },
          error: err => {
            this.toastService.show("Hubo un error al intentar recuperar los mensajes de este chat, " +
              "intenté recargar la pagina.", "bg-danger");
            console.error(err);
          }
        })
      );
    } else {
      this.isChatLoaded = true;
    }
  }

  ngOnDestroy(): void {
    this.chatService.disconnectFromTheCurrentChat();
  }

  sendMessage() {
    if(this.messageToSend.length > 0) {
      const messageId = uuidv4();
      const message: MessageDto =
        { chatId: this.chat.chatId, messageId: messageId,  message: this.messageToSend, timestamp: new Date() } as MessageDto;
      this.lastSentMessageId = messageId;
      this.chatService.sendMessage(message).subscribe({
        error: err => {
          this.lastSentMessageId = "";
        }
      });
    }
  }

  hasTheMessagesDateChanged(msgTimeStamp: number, msgIndex: number): boolean {
    if(msgIndex != 0 && this.chat.messages[msgIndex-1].timestamp !== msgTimeStamp) {
      return false;
    }
    return true;
  }

  convertMsgTimestampToDate(msgTimeStamp: number): Date {
    return new Date(msgTimeStamp * 1000);
  }
}

