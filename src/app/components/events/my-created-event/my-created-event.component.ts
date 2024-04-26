import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {CreatedEventResponse} from "../../../models/event/createdEventDto";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {CreateEventRequest} from "../../../models/event/createEventRequest";
import {DatePipe} from "@angular/common";
import {EventDurationUnit} from "../../../models/event/eventDurationUnit";
import {CreateEventComponent} from "../create-event/create-event.component";
import {AddressEntity} from "../../../models/location/AddressEntity";
import {HourPipe} from "../../../pipe/hour.pipe";

@Component({
  selector: 'rr-my-created-event',
  standalone: true,
  imports: [
    DatePipe,
    HourPipe
  ],
  templateUrl: './my-created-event.component.html',
  styleUrl: './my-created-event.component.css'
})
export class MyCreatedEventComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private eventService: EventService = inject(EventService);
  event: CreatedEventResponse = {} as CreatedEventResponse;
  private eventId: string = "";

  guests: {userId: string, username: string, photo: Blob | string | null}[] = [];

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.eventId = params['id'];
    });

    const event = this.eventService.lastCreatedEvent;

    if(event !== null) {
      this.event = event;
      this.event.event.address = new AddressEntity(event.event.address.__type, event.event.address.address);
    } else {
      // If the requested event doesn't come from the create event view, ask the api for the event.
      // TODO: IMPLEMENT THIS.
    }
  }

  protected readonly EventDurationUnit = EventDurationUnit;
  protected readonly Array = Array;
}
