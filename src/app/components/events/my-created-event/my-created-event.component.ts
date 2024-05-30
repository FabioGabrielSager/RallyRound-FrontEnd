import {Component, inject, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {EventResponse} from "../../../models/event/eventResponse";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {DatePipe, NgClass} from "@angular/common";
import {EventDurationUnit} from "../../../models/event/eventDurationUnit";
import {AddressEntity} from "../../../models/location/AddressEntity";
import {ToastService} from "../../../services/toast.service";
import {EventState} from "../../../models/event/eventState";
import {EventResponseForEventCreators} from "../../../models/event/eventResponseForEventCreators";
import {EventInscriptionStatus} from "../../../models/event/eventInscriptionStatus";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
import {UserPublicProfileComponent} from "../../participants/user-public-profile/user-public-profile.component";

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
export class MyCreatedEventComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private eventService: EventService = inject(EventService);
  private toastService: ToastService = inject(ToastService);
  @Input() event: EventResponseForEventCreators = {} as EventResponseForEventCreators;
  isEventLoaded: boolean = false;
  private eventId: string = "";
  showUserProfile: boolean = false;
  showedUserProfileId: string = "";

  protected readonly EventDurationUnit = EventDurationUnit;
  protected readonly Array = Array;
  protected readonly EventState = EventState;


  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.eventId = params['id'];
    });

    if(this.event == null) {
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
      });
    } else {
      this.isEventLoaded = true;
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
}
