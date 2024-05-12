import {Component, inject, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {DatePipe} from "@angular/common";
import {HourPipe} from "../../../pipe/hour.pipe";
import {EventDurationUnit} from "../../../models/event/eventDurationUnit";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {ParticipantResume} from "../../../models/user/participant/participantResume";
import {ToastService} from "../../../services/toast.service";
import {ParticipantService} from "../../../services/rallyroundapi/participant.service";
import {BehaviorSubject, Subscription} from "rxjs";
import {CreateEventInscriptionResponse} from "../../../models/event/createEventInscriptionResponse";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../shared/alert/alert.component";
import {EventInscriptionStatus} from "../../../models/event/eventInscriptionStatus";
import {FormsModule} from "@angular/forms";
import {AddressEntity} from "../../../models/location/AddressEntity";
import {Router} from "@angular/router";
import {
  EventWithCreatorReputationAndInscriptionStatusDto
} from "../../../models/event/eventWithCreatorReputationAndInscriptionStatusDto";
import {EventState} from "../../../models/event/eventState";

@Component({
  selector: 'rr-event-details-component',
  standalone: true,
  imports: [
    DatePipe,
    HourPipe,
    FormsModule
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit,OnDestroy {
  @Input() eventId: string = "";
  @Input() event!: EventWithCreatorReputationAndInscriptionStatusDto;

  private modalService: NgbModal = inject(NgbModal);
  private eventService: EventService = inject(EventService);
  private toastService: ToastService = inject(ToastService)
  private participantService: ParticipantService = inject(ParticipantService);
  private router: Router = inject(Router);

  private subs: Subscription = new Subscription();
  eventCreator: ParticipantResume = {} as ParticipantResume;
  isEventLoaded: boolean = false;

  @ViewChild('hourSelector') hourSelector!: TemplateRef<any>;
  selectedHour: string = "";

  protected readonly Array = Array;
  protected readonly EventDurationUnit = EventDurationUnit;
  protected readonly EventInscriptionStatus = EventInscriptionStatus;

  ngOnInit(): void {
    if(this.eventId != "") {
      this.subs.add(
        this.eventService.findEventWithCreatorReputationById(this.eventId)
          .subscribe({
            next: event => {
              this.event = event as EventWithCreatorReputationAndInscriptionStatusDto;
              this.event.event.address = new AddressEntity(event.event.address.__type, event.event.address.address);
              const eventCreator =
                this.event.eventParticipants.find(p => p.eventCreator);
              if(eventCreator)
                this.eventCreator = eventCreator.participant;

              this.eventId = event.eventId;
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

      this.eventId = this.event.eventId;
      this.isEventLoaded = true;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onJoinEvent() {
    const wantsToContinue: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    if(this.event.event.inscriptionPrice > 0) {
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
            this.participantService.createEventInscription(this.eventId).subscribe(
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
                  this.router.navigate([ 'events',
                    { outlets: { events: ['myevents', 'enrolled', value.eventId]}}]);
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
    if(this.event.eventInscriptionStatus === EventInscriptionStatus.INCOMPLETE_MISSING_HOUR_VOTE) {
      const modal: NgbModalRef = this.modalService.open(AlertComponent, {});
      modal.componentInstance.isAConfirm = true;
      modal.componentInstance.bodyTemplate = this.hourSelector;
      modal.componentInstance.title = "Elige el horario del evento que mejor se ajuste a tí.";
      modal.componentInstance.confirmBehavior = () => {
        this.participantService.completeEventInscription(this.eventId, new HourPipe().transform(this.selectedHour)).subscribe(
          {
            next: value => {
              this.toastService.show("Inscripción completada",
              "bg-success"); location.reload();
              },
            error: err => { console.error(err); }
          }
        );
      }
    }
  }

  protected readonly EventState = EventState;
}
