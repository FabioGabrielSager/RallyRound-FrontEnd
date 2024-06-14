import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";
import {ParticipantResume} from "../../../../models/user/participant/participantResume";

@Component({
  selector: 'rr-search-participant-result-list',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './search-participant-result-list.component.html',
  styleUrl: './search-participant-result-list.component.css'
})
export class SearchParticipantResultListComponent {
  @Input() resultsList: ParticipantResume[] = [];
  @Output() onSelectedResult = new EventEmitter();

  onClickSearchResult(index: number) {
    this.onSelectedResult.emit(index);
  }
}
