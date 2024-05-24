import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal, NgbRating} from "@ng-bootstrap/ng-bootstrap";
import {NgClass} from "@angular/common";
import {EventFeedbackRequest} from "../../../models/event/eventFeedbackRequest";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'rr-event-feedback-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgbRating,
    NgClass
  ],
  templateUrl: './event-feedback-modal.component.html',
  styleUrl: './event-feedback-modal.component.css'
})
export class EventFeedbackModalComponent implements OnInit {
  activeModal: NgbActiveModal = inject(NgbActiveModal);
  @Input() eventId!: string;
  @Output() onFeedbackSubmitSuccess = new EventEmitter();
  feedback: EventFeedbackRequest = new EventFeedbackRequest();
  submitButtonWasPressed: boolean = false;
  private eventService: EventService = inject(EventService);
  private toastService: ToastService = inject(ToastService);

  ngOnInit(): void {
    this.feedback.eventId = this.eventId;
  }

  onSubmitFeedback() {
    this.submitButtonWasPressed = true;
    if (this.feedback.overallSatisfaction === 0 || this.feedback.organizationRating === 0
      || this.feedback.coordinatorsRating === 0 || this.feedback.contentQualityRating === 0
      || this.feedback.valueForMoneyRating === 0 || this.feedback.venueRating === 0) {
      return;
    }

    this.eventService.sendEventFeedback(this.feedback).subscribe(
      {
        next: () => {
          this.toastService.show("Feedback enviado con éxito.", "bg-success");
          this.onFeedbackSubmitSuccess.emit();
          this.onFeedbackSubmitSuccess.complete();
          this.activeModal.close();
        },
        error: err => {
          if(err.status == 400 && String(err.error.message)
            .includes("Feedback has already been provided for this event.")) {
            this.toastService.show("No puedes enviar feedback sobre el mismo evento dos veces.",
              "bg-danger");
          } else {
            this.toastService.show("Hubo un error al intentar enviar el feedback.", "bg-danger");
          }
        }
      }
    )
  }
}
