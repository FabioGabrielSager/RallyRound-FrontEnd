import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {EventDto} from "../../../models/event/eventDto";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {CreateEventRequest} from "../../../models/event/createEventRequest";
import {DatePipe} from "@angular/common";
import {EventDurationUnit} from "../../../models/event/eventDurationUnit";
import {CreateEventComponent} from "../create-event/create-event.component";
import {AddressEntity} from "../../../models/location/AddressEntity";
import {HourPipe} from "../../../pipe/hour.pipe";
import {ToastService} from "../../../services/toast.service";

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
  private toastService: ToastService = inject(ToastService);
  event: EventDto = {} as EventDto;
  isEventLoaded: boolean = false;
  private eventId: string = "";

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.eventId = params['id'];
    });

    const event = this.eventService.lastCreatedEvent;

    if(event !== null) {
      this.event = event;
      this.event.event.address = new AddressEntity(event.event.address.__type, event.event.address.address);
      this.isEventLoaded = true;
    } else {
      // If the requested event doesn't come from the create event view, ask the api for the event.
      this.eventService.findEventWithCreatorReputationById(this.eventId).subscribe({
        next: event => {
          this.event = event;
          this.event.event.address = new AddressEntity(event.event.address.__type, event.event.address.address);
          this.isEventLoaded = true;
        },
        error: err => {
          this.toastService.show("Hubo un error al intentar recuperar el evento.", "bg-danger");
          console.error(err);
        }
      });
    }
  }

  protected readonly EventDurationUnit = EventDurationUnit;
  protected readonly Array = Array;
}
