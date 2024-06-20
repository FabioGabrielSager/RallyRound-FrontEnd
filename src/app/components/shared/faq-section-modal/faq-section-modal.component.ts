import {Component, inject} from '@angular/core';
import {EventsFeeStatisticsComponent} from "../../events/events-fee-statistics/events-fee-statistics.component";
import {FaqSectionComponent} from "../faq-section/faq-section.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'rr-faq-section-modal',
  standalone: true,
  imports: [
    EventsFeeStatisticsComponent,
    FaqSectionComponent
  ],
  templateUrl: './faq-section-modal.component.html',
  styleUrl: './faq-section-modal.component.css'
})
export class FaqSectionModalComponent {
  activeModal: NgbActiveModal = inject(NgbActiveModal);
}
