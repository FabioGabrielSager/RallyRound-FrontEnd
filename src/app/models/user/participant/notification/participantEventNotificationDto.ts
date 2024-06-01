import {ParticipantEventNotificationType} from "./participantEventNotificationType";

export interface ParticipantEventNotificationDto {
  type: ParticipantEventNotificationType;
  impliedResourceId: string;
  title: string;
  message: string;
  id: string;
  timestamp: string;
  viewed: boolean;
  participantEventCreated: boolean;
}
