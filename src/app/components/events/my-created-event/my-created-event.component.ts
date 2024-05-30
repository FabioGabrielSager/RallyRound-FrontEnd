import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {DatePipe, NgClass} from "@angular/common";
import {EventDurationUnit} from "../../../models/event/eventDurationUnit";
import {AddressEntity} from "../../../models/location/AddressEntity";
import {ToastService} from "../../../services/toast.service";
import {EventState} from "../../../models/event/eventState";
import {EventResponseForEventCreators} from "../../../models/event/eventResponseForEventCreators";
import {NgbModal, NgbModalRef, NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {UserPublicProfileComponent} from "../../participants/user-public-profile/user-public-profile.component";
import {AlertComponent} from "../../shared/alert/alert.component";
import {Subscription} from "rxjs";

@Component({
  selector: 'rr-my-created-event',
  standalone: true,
  imports: [
    DatePipe,
    NgbTooltip,
    NgClass,
    UserPublicProfileComponent
  ],
  templateUrl: './my-created-event.component.html',
  styleUrl: './my-created-event.component.css'
})
export class MyCreatedEventComponent implements OnInit, OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private eventService: EventService = inject(EventService);
  private toastService: ToastService = inject(ToastService);
  private modalService: NgbModal = inject(NgbModal);
  private subs: Subscription = new Subscription();
  private router: Router = inject(Router);

  @Input() event: EventResponseForEventCreators = {} as EventResponseForEventCreators;
  isEventLoaded: boolean = false;
  private eventId: string = "";
  showUserProfile: boolean = false;
  showedUserProfileId: string = "";

  protected readonly EventDurationUnit = EventDurationUnit;
  protected readonly Array = Array;
  protected readonly EventState = EventState;


  ngOnInit(): void {
    this.subs.add(
      this.route.params.subscribe((params: Params) => {
        this.eventId = params['id'];
      })
    );


    if(this.event == null) {
      this.subs.add(
        this.eventService.getCurrentUserCreatedEvent(this.eventId).subscribe({
          next: event => {
            this.event = event;
            this.event.address = new AddressEntity(event.address.__type, event.address.address);
            this.isEventLoaded = true;
          },
          error: err => {
            this.toastService.show("Hubo un error al intentar recuperar el evento.", "bg-danger");
            console.error(err);
          }
        })
      );
    } else {
      this.isEventLoaded = true;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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

  onClickCancelEvent() {
    const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true});
    modal.componentInstance.isAConfirm = true;
    modal.componentInstance.title = "Cancelar evento.";
    modal.componentInstance.bodyString = {
      textParagraphs: [
        "¿Seguro quieres cancelar este evento?"
      ]
    };
    modal.componentInstance.confirmBehavior = () => {
      this.subs.add(
        this.eventService.cancelEvent(this.eventId).subscribe({
          next: () => {
            this.toastService.show("Evento cancelado con éxito.", "bg-success");
            location.reload();
          },
          error: err => console.error(err)
        })
      );
    };
  }

  onClickModifyEvent() {
    this.router.navigate(["events", { outlets: { events: ["myevents", "modify", this.eventId]}}]);
  }
}
