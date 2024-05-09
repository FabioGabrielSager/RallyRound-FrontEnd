import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe} from "@angular/common";
import {HourPipe} from "../../../pipe/hour.pipe";
import {EventResumeDto} from "../../../models/event/eventResumeDto";
import {EventInscriptionStatus} from "../../../models/event/eventInscriptionStatus";

@Component({
  selector: 'rr-event-resume-card',
  standalone: true,
  imports: [
    DatePipe,
    HourPipe
  ],
  templateUrl: './event-resume-card.component.html',
  styleUrl: './event-resume-card.component.css'
})
export class EventResumeCardComponent {
  @Input() eventResume!: EventResumeDto;
  @Output() onSeeEvent: EventEmitter<string> = new EventEmitter();

  protected readonly Array = Array;
  protected readonly EventInscriptionStatus = EventInscriptionStatus;

  onViewEventClick(eventId: string) {
    this.onSeeEvent.emit(eventId);
  }
}
