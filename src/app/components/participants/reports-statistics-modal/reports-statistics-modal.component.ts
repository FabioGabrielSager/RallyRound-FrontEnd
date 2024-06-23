import {Component, inject} from '@angular/core';
import {
    EventsForActivityStatisticsComponent
} from "../../events/events-for-activity-statistics/events-for-activity-statistics.component";
import {ReportsStatisticsComponent} from "../reports-statistics/reports-statistics.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'rr-reports-statistics-modal',
  standalone: true,
  imports: [
    EventsForActivityStatisticsComponent,
    ReportsStatisticsComponent
  ],
  templateUrl: './reports-statistics-modal.component.html',
  styleUrl: './reports-statistics-modal.component.css'
})
export class ReportsStatisticsModalComponent {
  activeModal: NgbActiveModal = inject(NgbActiveModal);

}
