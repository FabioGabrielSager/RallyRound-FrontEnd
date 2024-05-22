import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {EventDetailsComponent} from "../event-details-component/event-details.component";
import {EventInscriptionStatus} from "../../../models/event/eventInscriptionStatus";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject, Subscription} from "rxjs";
import {AddressEntity} from "../../../models/location/AddressEntity";
import {ChatComponent} from "../../shared/chat/chat.component";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {Location, NgClass} from "@angular/common";
import {ToastService} from "../../../services/toast.service";
import {MyCreatedEventComponent} from "../my-created-event/my-created-event.component";
import {browserRefresh} from "../../../app.component";
import {EventResponseForParticipants} from "../../../models/event/eventResponseForParticipants";
import {EventState} from "../../../models/event/eventState";

@Component({
  selector: 'rr-user-event',
  standalone: true,
  imports: [
    EventDetailsComponent,
    ChatComponent,
    MyCreatedEventComponent,
    NgClass
  ],
  templateUrl: './user-event.component.html',
  styleUrl: './user-event.component.css'
})
export class UserEventComponent implements OnInit, OnDestroy {
  private eventService: EventService = inject(EventService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private subs: Subscription = new Subscription();
  private location: Location = inject(Location);
  private toastService: ToastService = inject(ToastService);

  private eventId: string = "";
  event: EventResponseForParticipants = {} as EventResponseForParticipants;
  isChatPageSelected: boolean = false;
  showAsACreatorView: boolean = false;
  protected readonly EventInscriptionStatus = EventInscriptionStatus;
  isEventLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  ngOnInit(): void {
    this.subs.add(
      this.route.params.subscribe(params => this.eventId = params['id'])
    );

    const event = this.eventService.getLastRequestedEvent(this.eventId);
    if (event === null || event.event === null) {
      this.toastService.show("Hubo un error al intentar acceder a la sala del evento.", "bg-danger");
      console.error("Error: There is no lastRequestedEvent. The lastRequestedEvent variable in EventService must not be " +
        "null before entering this component.");
      this.location.back();
    } else {
      if (event.isEventCreatedByCurrentUser != undefined) {
        this.showAsACreatorView = event.isEventCreatedByCurrentUser;
      }

      if (!browserRefresh) {
        this.event = event.event;
        this.event.address = new AddressEntity(this.event.address.__type,
          this.event.address.address);
        this.isEventLoaded$.next(true);
      } else {
        if (this.showAsACreatorView) {
          this.subs.add(
            this.eventService.getCurrentUserCreatedEvent(event.event.id).subscribe({
              next: value => {
                this.event = value as EventResponseForParticipants;
                this.event.address = new AddressEntity(this.event.address.__type,
                  this.event.address.address);
                this.isEventLoaded$.next(true);
              },
              error: err => {
                this.toastService.show("Hubo un error al intentar recuperar el evento.", "bg-danger");
                console.error(err);
              }
            })
          )
        } else {
          this.subs.add(
            this.eventService.getCurrentUserParticipatingEvent(event.event.id).subscribe(
              {
                next: value => {
                  this.event = value;
                  this.event.address = new AddressEntity(this.event.address.__type,
                    this.event.address.address);
                  this.isEventLoaded$.next(true);
                },
                error: err => {
                  this.toastService.show("Hubo un error al intentar recuperar el evento.", "bg-danger");
                  console.error(err);
                }
              }
            )
          );
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSelectPage() {
    this.isChatPageSelected = !this.isChatPageSelected;
  }

  protected readonly EventState = EventState;
}
