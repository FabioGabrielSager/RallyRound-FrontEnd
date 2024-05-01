import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {DatePipe} from "@angular/common";
import {HourPipe} from "../../../pipe/hour.pipe";
import {EventDurationUnit} from "../../../models/event/eventDurationUnit";
import {EventWithParticipantReputationDto} from "../../../models/event/eventWithParticipantReputationDto";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {ParticipantResume} from "../../../models/user/participant/participantResume";
import {AddressEntity} from "../../../models/location/AddressEntity";

@Component({
  selector: 'rr-event-details-public-component',
  standalone: true,
  imports: [
    DatePipe,
    HourPipe
  ],
  templateUrl: './event-details-public-component.component.html',
  styleUrl: './event-details-public-component.component.css'
})
export class EventDetailsPublicComponentComponent implements OnInit {
  @Input() eventId: string = "";

  private eventService: EventService = inject(EventService);

  event: EventWithParticipantReputationDto = {} as EventWithParticipantReputationDto;
  eventCreator: ParticipantResume = {} as ParticipantResume;

  protected readonly Array = Array;
  protected readonly EventDurationUnit = EventDurationUnit;
  isEventLoaded: boolean = false;

  ngOnInit(): void {
    this.eventService.findEventById(this.eventId)
      .subscribe({
        next: event => {
          this.event = event;
          this.event.event.address = new AddressEntity(event.event.address.__type, event.event.address.address);
          const eventCreator =
            this.event.eventParticipants.find(p => p.eventCreator);
          if(eventCreator)
            this.eventCreator = eventCreator.participant;

          this.isEventLoaded = true;
        },
        error: err => console.error(err)
      })
  }
}
