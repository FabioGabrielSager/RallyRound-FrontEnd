import {Component, inject} from '@angular/core';
import {FaqSectionComponent} from "../faq-section/faq-section.component";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {
  TermsAndConditionsComponent
} from "../../participants/registration/terms-and-conditions/terms-and-conditions.component";

@Component({
  selector: 'rr-terms-and-conditions-modal',
  standalone: true,
  imports: [
    FaqSectionComponent,
    TermsAndConditionsComponent
  ],
  templateUrl: './terms-and-conditions-modal.component.html',
  styleUrl: './terms-and-conditions-modal.component.css'
})
export class TermsAndConditionsModalComponent {
  activeModal: NgbActiveModal = inject(NgbActiveModal);
}
