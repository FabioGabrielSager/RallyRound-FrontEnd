import {MessageDto} from "./messageDto";
import {ChatMessage} from "./chatMessage";

export interface ChatMessages {
  chatId: string
  messages: ChatMessage[]
}
