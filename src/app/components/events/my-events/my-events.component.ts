import {Component, inject, OnInit} from '@angular/core';
import {EventResumeDto} from "../../../models/event/eventResumeDto";
import {EventResumeCardComponent} from "../event-resume-card/event-resume-card.component";
import {NgbCollapse, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {Router, RouterLink} from "@angular/router";
import {AlertComponent} from "../../shared/alert/alert.component";
import {MPAuthService} from "../../../services/rallyroundapi/mercadopago/mpauth.service";
import {ToastService} from "../../../services/toast.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SearchResultsListComponent} from "../../shared/search-results-list/search-results-list.component";
import {NgClass} from "@angular/common";
import {EventService} from "../../../services/rallyroundapi/event.service";

@Component({
  selector: 'rr-my-events',
  standalone: true,
  imports: [
    EventResumeCardComponent,
    NgbCollapse,
    RouterLink,
    ReactiveFormsModule,
    SearchResultsListComponent,
    NgClass
  ],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent implements OnInit {
  isMyCreatedEventsPageSelected: boolean = false;
  eventsAreLoading: boolean = false;
  events: EventResumeDto[] = [];
  private eventService: EventService = inject(EventService);
  private subs: Subscription = new Subscription();
  private mpAuthService: MPAuthService = inject(MPAuthService);
  private modalService: NgbModal = inject(NgbModal);
  private toastService: ToastService = inject(ToastService);
  private router: Router = inject(Router);
  form!: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);

  ngOnInit(): void {
    this.form = this.fb.group({
      activity: ['Actividad', Validators.required],
      description: ['', [Validators.required, Validators.maxLength( 2000)]],
      address: ['', Validators.required],
      streetNumberCheckBox: [''],
      streetNumber: [''],
      date: ['', Validators.required],
      hours: this.fb.array([]),
      duration: ['', Validators.required],
      durationUnit: ['HOUR', Validators.required],
      participants: ['1', [Validators.required, Validators.min(1)]],
      inscriptionPrice: ['', [Validators.required, Validators.min(1)]],
      participantOrganizer: ['organizer', Validators.required],
      selectedHour: []
    });
    this.getMyEvents();
  }

  onSelectPage() {
    this.isMyCreatedEventsPageSelected = !this.isMyCreatedEventsPageSelected;

    if(!this.isMyCreatedEventsPageSelected) {
      this.getMyEvents();
    } else {
      this.getMyCreatedEvents();
    }
  }

  private getMyEvents() {
    // TODO: Add the required filters for this parameters
    this.eventsAreLoading = true;
    this.eventService.getCurrentUserParticipatingEvents(null, null, null,
      undefined, undefined, undefined,
      undefined, undefined, null, null, []).subscribe(
      {
        next: value => {
          this.events = value.results;
          this.eventsAreLoading = false;
        },
        error: err => {
          this.eventsAreLoading = false;
          console.error(err);
        }
      }
    );
  }

  private getMyCreatedEvents() {
    // TODO: Add the required filters for this parameters
    this.eventsAreLoading = true;
    this.eventService.getCurrentUserCreatedEvents(undefined, undefined, undefined,
      undefined, undefined, null, null, []).subscribe(
      {
        next: value => {
          this.events = value.results;
          this.eventsAreLoading = false;
        },
        error: err => {
          this.eventsAreLoading = false;
          console.error(err);
        }
      }
    );
  }

  onSeeEvent(eventId: string) {
    if(this.isMyCreatedEventsPageSelected) {
      this.subs.add(
        this.eventService.getCurrentUserCreatedEvent(eventId).subscribe({
          next: () => {
            this.router.navigate(['events', { outlets: { events: ['myevents', eventId]}}]);
          },
          error: err => {
            this.toastService.show("Hubo un error al intentar recuperar el evento.", "bg-danger");
            console.error(err);
          }
        })
      )
    } else {
      this.subs.add(
        this.eventService.getCurrentUserParticipatingEvent(eventId).subscribe(
          {
            next: () => {
              this.router.navigate([ 'events', { outlets: { events: ['myevents', eventId]}}]);
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

  // TODO: Check if this duplicate code can be avoided
  onCreateEvent() {
    this.subs.add(
      this.mpAuthService.isAccountLinked().subscribe({
        next: (result) => {
          if (!result) {
            const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: 'lg'});
            modal.componentInstance.isAConfirm = true;
            modal.componentInstance.title = "Vincular mercado pago";
            modal.componentInstance.bodyString = {
              textParagraphs: [
                "Para crear un evento primero debes vincular tu cuenta de mercado pago.",
                "¿Quieres vincular tu cuenta de mercado pago?"
              ]
            };
            modal.componentInstance.confirmBehavior = () => {
              this.subs.add(
                this.mpAuthService.getAuthUrl().subscribe({
                  next: (url: string) => {
                    const width = 600;
                    const height = 800;
                    const left = window.innerWidth / 2 - width / 2;
                    const top = window.innerHeight / 2 - height / 2;
                    const features =
                      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;
                    window.open(url, '_blank', features);
                  },
                  error: err => {
                    this.toastService.show("Hubo un error al intentar recuperar la dirección de autenticación " +
                      "de mercado pago, por favor inténtelo más tarde.", "bg-danger");
                  }
                })
              );
            }
          } else {
            this.router.navigate(['/events/', {outlets: {events: ['create']}}]);
          }
        },
        error: err => {
          this.toastService.show("Hubo un error al intentar verificar su vinculación con mercado pago, " +
            "por favor inténtelo más tarde.", "bg-danger");
        }
      })
    );
  }
}
