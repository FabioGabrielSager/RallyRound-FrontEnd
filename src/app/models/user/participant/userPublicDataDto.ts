import {ParticipantResume} from "./participantResume";
import {UserFavoriteActivity} from "./userFavoriteActivity";

export interface UserPublicDataDto extends ParticipantResume {
  reputationAsEventCreator: string;
  reputationAsParticipant: string;
  favoriteActivities: UserFavoriteActivity[];
  isDeletedAccount: boolean;
}
