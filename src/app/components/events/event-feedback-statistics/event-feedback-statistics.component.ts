import {Component, Input} from '@angular/core';
import {EventFeedbackStatistics} from "../../../models/event/eventFeedbackStatistics";
import {NgbRating} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'rr-event-feedback-statistics',
  standalone: true,
  imports: [
    NgbRating
  ],
  templateUrl: './event-feedback-statistics.component.html',
  styleUrl: './event-feedback-statistics.component.css'
})
export class EventFeedbackStatisticsComponent {
  @Input() eventFeedbackResume: EventFeedbackStatistics = new EventFeedbackStatistics();
}
