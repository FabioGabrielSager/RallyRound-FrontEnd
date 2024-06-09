import {Component, inject, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DatePipe, NgClass} from "@angular/common";
import {EventDurationUnit} from "../../../models/event/eventDurationUnit";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {ParticipantResume} from "../../../models/user/participant/participantResume";
import {ToastService} from "../../../services/toast.service";
import {ParticipantService} from "../../../services/rallyroundapi/participant.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {CreateEventInscriptionResponse} from "../../../models/event/createEventInscriptionResponse";
import {NgbModal, NgbModalRef, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../shared/alert/alert.component";
import {EventInscriptionStatus} from "../../../models/event/eventInscriptionStatus";
import {FormsModule} from "@angular/forms";
import {AddressEntity} from "../../../models/location/AddressEntity";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {EventState} from "../../../models/event/eventState";
import {EventResponseForParticipants} from "../../../models/event/eventResponseForParticipants";
import {UserPublicProfileComponent} from "../../participants/participant-public-profile/user-public-profile/user-public-profile.component";
import {ParticipantReputationMessages} from "../../../models/user/participant/reputation/participantReputationMessages";
import {EventFeedbackModalComponent} from "../event-feedback-modal/event-feedback-modal.component";
import {
  ReportParticipantModalComponent
} from "../../participants/report-participant-modal/report-participant-modal.component";

@Component({
  selector: 'rr-event-details-component',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgClass,
    NgbTooltip,
    UserPublicProfileComponent
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit,OnDestroy {
  @Input() eventId: string = "";
  @Input() event!: EventResponseForParticipants;

  private modalService: NgbModal = inject(NgbModal);
  private eventService: EventService = inject(EventService);
  private toastService: ToastService = inject(ToastService)
  private eventInscription: ParticipantService = inject(ParticipantService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);

  private subs: Subscription = new Subscription();
  eventCreator: ParticipantResume = {} as ParticipantResume;
  participantReputationMessages = ParticipantReputationMessages;

  isEventLoaded: boolean = false;

  showUserProfile: boolean = false;
  showedUserProfileId: string = "";

  @ViewChild('hourSelector') hourSelector!: TemplateRef<any>;
  selectedHour: string = "";

  protected readonly EventState = EventState;
  protected readonly Array = Array;
  protected readonly EventDurationUnit = EventDurationUnit;
  protected readonly EventInscriptionStatus = EventInscriptionStatus;

  ngOnInit(): void {
    this.subs.add(
      this.route.params.subscribe((params: Params) => {
        this.eventId = params['id'];
      })
    );

    if(this.event == null && this.eventId != "") {
      this.subs.add(
        this.eventService.findEventWithCreatorReputationById(this.eventId)
          .subscribe({
            next: event => {
              this.event = event as EventResponseForParticipants;
              this.event.address = new AddressEntity(event.address.__type, event.address.address);
              const eventCreator =
                this.event.eventParticipants.find(p => p.eventCreator);
              if(eventCreator)
                this.eventCreator = eventCreator.participant;

              this.eventId = event.id;
              this.isEventLoaded = true;
            },
            error: err => {
              this.toastService.show("Error al intentar recuperar el eventos. Por favor, recargue la pagina.",
                "bg-danger");
              console.error(err);
            }
          })
      );
    } else {
      const eventCreator =
        this.event.eventParticipants.find(p => p.eventCreator);

      if(eventCreator)
        this.eventCreator = eventCreator.participant;

      this.eventId = this.event.id;
      this.isEventLoaded = true;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onJoinEvent() {
    const wantsToContinue: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    if(this.event.inscriptionPrice > 0) {
      const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: 'lg'});
      modal.componentInstance.isAConfirm = true;
      modal.componentInstance.title = "Inscribirse en evento";
      modal.componentInstance.bodyString = {
        textParagraphs: [
          "Este evento requiere pago de inscripción.",
          "¿Desea continuar?"
        ]
      };
      modal.componentInstance.confirmBehavior = () => {
        wantsToContinue.next(true);
      }
    }
    else {
      wantsToContinue.next(true);
    }

    wantsToContinue.subscribe({
      next: value => {
        if (value) {
          this.subs.add(
            this.eventInscription.createEventInscription(this.eventId).subscribe(
              {
                next: (value: CreateEventInscriptionResponse) => {
                  if(value.requiresPayment) {
                    const width = 600;
                    const height = 800;
                    const left = window.innerWidth / 2 - width / 2;
                    const top = window.innerHeight / 2 - height / 2;
                    const features =
                      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;
                    window.open(value.paymentLink, '_blank', features);
                  }

                  // Reloading lastEventRequested event service variable
                  this.subs.add(
                    this.eventService.getCurrentUserParticipatingEvent(value.eventId).subscribe(
                      {
                        next: () => {
                          this.router.navigate([ 'events',
                            { outlets: { events: ['myevents', value.eventId]}}]);
                        },
                        error: err => console.log(err)
                      }
                    )
                  );

                },
                error: err => {
                  const statusCode: number = err.status;
                  if(statusCode >= 400) {
                    this.toastService.show("Este evento ya no acepta mas participantes.",
                      "bg-danger");
                  }

                  if(statusCode >= 500) {
                    this.toastService.show("Hubo un error al enviar la solicitud de inscripción, por favor " +
                      "inténtelo más tarde.", "bg-danger");
                  }

                  console.error(err);
                }
              }
            )
          );
        }
      }
    });
  }

  onCompleteInscription() {
    if(this.event.eventInscriptionStatus === EventInscriptionStatus.INCOMPLETE_MISSING_PAYMENT_AND_HOUR_VOTE) {
      this.eventInscription.retrieveEventInscriptionPaymentLink(this.eventId).subscribe({
        next: (paymentLink: string) => {
            const width = 600;
            const height = 800;
            const left = window.innerWidth / 2 - width / 2;
            const top = window.innerHeight / 2 - height / 2;
            const features =
              `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;
            window.open(paymentLink, '_blank', features);
            console.log(paymentLink);
        },
        error: () => {
          this.toastService.show("Hubo un error al intentar recuperar el link de pago.", "bg-danger");
        }
      })
    }

    if(this.event.eventInscriptionStatus === EventInscriptionStatus.INCOMPLETE_MISSING_HOUR_VOTE) {
      const modal: NgbModalRef = this.modalService.open(AlertComponent, {});
      modal.componentInstance.isAConfirm = true;
      modal.componentInstance.bodyTemplate = this.hourSelector;
      modal.componentInstance.title = "Elige el horario del evento que mejor se ajuste a tí.";
      modal.componentInstance.confirmBehavior = () => {
        this.eventInscription.completeEventInscription(this.eventId, this.selectedHour).subscribe(
          {
            next: () => {
              this.toastService.show("Inscripción completada",
              "bg-success");
              location.reload();
              },
            error: err => { console.error(err); }
          }
        );
      }
    }
  }

  getHourVotes(h: string) {
    return this.event.startingHoursTimesVoted.get(h);
  }

  onClickUser(userId: string) {
    this.showUserProfile = true;
    this.showedUserProfileId = userId;
  }

  onCloseUserProfileView() {
    this.showedUserProfileId = "";
    this.showUserProfile = false;
  }

  onSendFeedback() {
    const modal = this.modalService.open(EventFeedbackModalComponent,
      { centered: true, size: "lg" });

    modal.componentInstance.eventId = this.eventId;

    this.subs.add(
      modal.componentInstance.onFeedbackSubmitSuccess.subscribe(() => {
        this.event.hasAlreadySentEventFeedback = true
      })
    );
  }

  onCancelInscription() {
    const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: 'lg'});
    modal.componentInstance.isAConfirm = true;
    modal.componentInstance.title = "Cancelar inscripción a evento.";
    modal.componentInstance.bodyString = {
      textParagraphs: [
        "¿Seguro que quieres cancelar tu inscripción a evento?",
        "Ten en cuenta que si la inscripción es paga, el dinero no te será rembolsado."
      ]
    };
    modal.componentInstance.confirmBehavior = () => {
      this.subs.add(
        this.eventInscription.cancelEventInscription(this.eventId).subscribe({
          next: () => {
            this.toastService.show("Inscripción cancelada con éxito.",
              "bg-success");
            this.router.navigate(['/events/', { outlets: { events: ['myevents']}}]);
          },
          error: err => {
            console.error(err);
          }
        })
      );
    }
  }

  onLeaveEvent() {
    const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: 'lg'});
    modal.componentInstance.isAConfirm = true;
    modal.componentInstance.title = "Abandonar evento.";
    modal.componentInstance.bodyString = {
      textParagraphs: [
        "¿Seguro que quieres abandonar evento?",
        "Ten en cuenta que si la inscripción es paga, el dinero no te será rembolsado."
      ]
    };
    modal.componentInstance.confirmBehavior = () => {
      this.subs.add(
        this.eventInscription.leaveEvent(this.eventId).subscribe({
          next: () => {
            this.toastService.show("Evento abandonado éxito.",
              "bg-success");
            this.router.navigate(['/events/', { outlets: { events: ['myevents']}}]);
          },
          error: err => {
            console.error(err);
          }
        })
      );
    }
  }

  onReportUserClick() {
    const modal: NgbModalRef = this.modalService.open(ReportParticipantModalComponent, { centered: true});
    modal.componentInstance.reportedUserId = this.showedUserProfileId;
  }
}
