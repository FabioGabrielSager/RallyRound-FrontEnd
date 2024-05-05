import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe} from "@angular/common";
import {HourPipe} from "../../../pipe/hour.pipe";
import {EventResumeDto} from "../../../models/event/eventResumeDto";

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
    @Input() eventResume: EventResumeDto = {} as EventResumeDto;
    @Output() onSeeEvent: EventEmitter<string> = new EventEmitter();

    protected readonly Array = Array;

  onViewEventClick(eventId: string) {
    this.onSeeEvent.emit(eventId);
  }
}
