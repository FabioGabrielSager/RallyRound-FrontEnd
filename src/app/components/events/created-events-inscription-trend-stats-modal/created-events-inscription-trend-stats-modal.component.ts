import {Component, inject} from '@angular/core';
import {EventsFeeStatisticsComponent} from "../events-fee-statistics/events-fee-statistics.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {
  CreatedEventsInscriptionTrendStatsComponent
} from "../created-events-inscription-trend-stats/created-events-inscription-trend-stats.component";

@Component({
  selector: 'rr-created-events-inscription-trend-stats-modal',
  standalone: true,
  imports: [
    EventsFeeStatisticsComponent,
    CreatedEventsInscriptionTrendStatsComponent
  ],
  templateUrl: './created-events-inscription-trend-stats-modal.component.html',
  styleUrl: './created-events-inscription-trend-stats-modal.component.css'
})
export class CreatedEventsInscriptionTrendStatsModalComponent {
  activeModal: NgbActiveModal = inject(NgbActiveModal);
}
