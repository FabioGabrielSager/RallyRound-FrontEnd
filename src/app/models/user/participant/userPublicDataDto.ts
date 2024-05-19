import {ParticipantResume} from "./participantResume";
import {UserFavoriteActivity} from "./userFavoriteActivity";
import {ParticipantReputation} from "./reputation/participantReputation";

export interface UserPublicDataDto extends ParticipantResume {
  reputationAsEventCreator: ParticipantReputation;
  reputationAsParticipant: ParticipantReputation;
  favoriteActivities: UserFavoriteActivity[];
  isDeletedAccount: boolean;
}
