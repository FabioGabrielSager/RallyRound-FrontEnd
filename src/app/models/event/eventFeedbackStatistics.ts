import {EventComment} from "./eventComment";

export class EventFeedbackStatistics {
  eventId: string = "";
  feedbackCount: number = 0;
  overallSatisfaction: number = 0;
  organizationRating: number = 0;
  contentQualityRating: number = 0;
  venueRating: number = 0;
  coordinatorsRating: number = 0;
  valueForMoneyRating: number = 0;
  comments: EventComment[] = [];
}
