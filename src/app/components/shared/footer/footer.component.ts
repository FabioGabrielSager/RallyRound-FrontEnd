import {Component, inject} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FaqSectionModalComponent} from "../faq-section-modal/faq-section-modal.component";
import {TermsAndConditionsModalComponent} from "../terms-and-conditions-modal/terms-and-conditions-modal.component";

@Component({
  selector: 'rr-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  host: { style: "margin-top: auto;" }
})
export class FooterComponent {
  private modalService: NgbModal = inject(NgbModal);

  onClickFaq() {
    this.modalService.open(FaqSectionModalComponent, { fullscreen: true, scrollable: true });
  }

  onClickTermsAndConditions() {
    this.modalService.open(TermsAndConditionsModalComponent, { fullscreen: true, scrollable: true });
  }
}
