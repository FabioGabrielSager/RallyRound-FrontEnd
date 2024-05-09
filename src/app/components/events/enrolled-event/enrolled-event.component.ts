import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {EventDetailsComponent} from "../event-details-component/event-details.component";
import {EventInscriptionStatus} from "../../../models/event/eventInscriptionStatus";
import {ParticipantService} from "../../../services/rallyroundapi/participant.service";
import {ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs";
import {
  EventWithCreatorReputationAndInscriptionStatusDto
} from "../../../models/event/eventWithCreatorReputationAndInscriptionStatusDto";
import {AddressEntity} from "../../../models/location/AddressEntity";

@Component({
  selector: 'rr-enrolled-event',
  standalone: true,
  imports: [
    EventDetailsComponent
  ],
  templateUrl: './enrolled-event.component.html',
  styleUrl: './enrolled-event.component.css'
})
export class EnrolledEventComponent implements OnInit, OnDestroy {
  private participantService: ParticipantService = inject(ParticipantService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private subs: Subscription = new Subscription();

  private eventId: string = "";
  event: EventWithCreatorReputationAndInscriptionStatusDto = {} as EventWithCreatorReputationAndInscriptionStatusDto;
  isChatPageSelected: boolean = false;
  protected readonly EventInscriptionStatus = EventInscriptionStatus;
  isEventLoaded: boolean = false;

  ngOnInit(): void {
    this.subs.add(
      this.route.params.subscribe(params => this.eventId = params['id'])
    );

    this.subs.add(
      this.participantService.findParticipantSingedUpEvent(this.eventId).subscribe(
        {
          next: value => {
            this.event = value;
            this.event.event.address = new AddressEntity(value.event.address.__type, value.event.address.address);
            this.isEventLoaded = true;
          },
          error: err => console.log(err)
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSelectPage() {
    this.isChatPageSelected = !this.isChatPageSelected;
  }
}
