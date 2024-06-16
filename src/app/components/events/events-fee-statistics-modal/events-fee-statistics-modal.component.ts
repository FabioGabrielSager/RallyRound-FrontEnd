import {Component, inject} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {
  EventsForActivityStatisticsComponent
} from "../events-for-activity-statistics/events-for-activity-statistics.component";
import {EventsFeeStatisticsComponent} from "../events-fee-statistics/events-fee-statistics.component";

@Component({
  selector: 'rr-events-fee-statistics-modal',
  standalone: true,
  imports: [
    EventsForActivityStatisticsComponent,
    EventsFeeStatisticsComponent
  ],
  templateUrl: './events-fee-statistics-modal.component.html',
  styleUrl: './events-fee-statistics-modal.component.css'
})
export class EventsFeeStatisticsModalComponent {
  activeModal: NgbActiveModal = inject(NgbActiveModal);
}
