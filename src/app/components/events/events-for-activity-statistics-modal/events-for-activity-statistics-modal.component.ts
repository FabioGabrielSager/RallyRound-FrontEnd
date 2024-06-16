import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {
  EventsForActivityStatisticsComponent
} from "../events-for-activity-statistics/events-for-activity-statistics.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'rr-events-for-activity-statistics-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EventsForActivityStatisticsComponent
  ],
  templateUrl: './events-for-activity-statistics-modal.component.html',
  styleUrl: './events-for-activity-statistics-modal.component.css'
})
export class EventsForActivityStatisticsModalComponent {
  activeModal: NgbActiveModal = inject(NgbActiveModal);
}
