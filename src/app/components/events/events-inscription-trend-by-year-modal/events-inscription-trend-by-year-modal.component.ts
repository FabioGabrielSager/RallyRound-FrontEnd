import {Component, inject} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {
  EventsInscriptionTrendByYearComponent
} from "../events-inscription-trend-by-year/events-inscription-trend-by-year.component";

@Component({
  selector: 'rr-events-inscription-trend-by-year-modal',
  standalone: true,
  imports: [
    EventsInscriptionTrendByYearComponent
  ],
  templateUrl: './events-inscription-trend-by-year-modal.component.html',
  styleUrl: './events-inscription-trend-by-year-modal.component.css'
})
export class EventsInscriptionTrendByYearModalComponent {
  activeModal: NgbActiveModal = inject(NgbActiveModal);
}
