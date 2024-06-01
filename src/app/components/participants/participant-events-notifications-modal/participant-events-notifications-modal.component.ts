import {Component, inject, Input, OnDestroy} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {
  ParticipantEventNotificationDto
} from "../../../models/user/participant/notification/participantEventNotificationDto";
import {ParticipantNotificationService} from "../../../services/rallyroundapi/participant-notification.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'rr-participant-events-notification-modal',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './participant-events-notifications-modal.component.html',
  styleUrl: './participant-events-notifications-modal.component.css'
})
export class ParticipantEventsNotificationsModalComponent implements OnDestroy {
  private notificationService: ParticipantNotificationService = inject(ParticipantNotificationService);
  private eventService: EventService = inject(EventService);
  private toastService: ToastService = inject(ToastService);
  private router: Router = inject(Router);
  private subs: Subscription = new Subscription();

  activeModal: NgbActiveModal = inject(NgbActiveModal);
  @Input() notifications: ParticipantEventNotificationDto[] = [];

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onCloseNotification(notificationIndex: number): void {
    this.subs = this.notificationService.markNotificationAsViewed(this.notifications[notificationIndex].id)
      .subscribe({
        error: err => console.error(err)
        }
      );
    this.notifications.splice(notificationIndex, 1);
  }

  onSeeEvent(notification: ParticipantEventNotificationDto): void {
    if(notification.participantEventCreated) {
      this.subs.add(
        this.eventService.getCurrentUserCreatedEvent(notification.impliedResourceId).subscribe({
          next: () => {
            this.router.navigate(['events', { outlets: { events: ['myevents', notification.impliedResourceId]}}]);
            this.activeModal.close();
          },
          error: err => {
            this.toastService.show("Hubo un error al intentar recuperar el evento.", "bg-danger");
            console.error(err);
          }
        })
      )
    } else {
      this.subs.add(
        this.eventService.getCurrentUserParticipatingEvent(notification.impliedResourceId).subscribe(
          {
            next: () => {
              this.router.navigate([ 'events', { outlets: { events: ['myevents', notification.impliedResourceId]}}]);
              this.activeModal.close();
            },
            error: err => {
              this.toastService.show("Hubo un error al intentar recuperar el evento.", "bg-danger");
              console.log(err);
            }
          }
        )
      );
    }
  }
}
