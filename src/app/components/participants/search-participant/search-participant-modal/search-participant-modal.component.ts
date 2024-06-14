import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from "rxjs";
import {ParticipantService} from "../../../../services/rallyroundapi/participant.service";
import {CdkDrag, CdkDragHandle, CdkDropList} from "@angular/cdk/drag-drop";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SearchResultsListComponent} from "../../../shared/search-results-list/search-results-list.component";
import {ParticipantResume} from "../../../../models/user/participant/participantResume";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {
  SearchParticipantResultListComponent
} from "../search-participant-result-list/search-participant-result-list.component";
import {NgClass} from "@angular/common";

@Component({
  selector: 'rr-search-participant-modal',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    FormsModule,
    ReactiveFormsModule,
    SearchResultsListComponent,
    SearchParticipantResultListComponent,
    NgClass
  ],
  templateUrl: './search-participant-modal.component.html',
  styleUrl: './search-participant-modal.component.css'
})
export class SearchParticipantModalComponent implements OnInit, OnDestroy {
  private subs: Subscription = new Subscription();
  private participant: ParticipantService = inject(ParticipantService);
  activeModal: NgbActiveModal = inject(NgbActiveModal);

  query: string = "";
  results: ParticipantResume[] = [];

  @Output() onClickParticipant: EventEmitter<ParticipantResume> = new EventEmitter();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onClickSearchResult($event: number) {
    this.onClickParticipant.emit(this.results[$event]);
  }

  onInputValueChanges() {
    if(this.query) {
      this.subs.add(
        this.participant.searchParticipant(this.query).subscribe({
          next: value => this.results = value.matches,
          error: err => console.error(err)
        })
      );
    } else {
      this.results = [];
    }
  }
}
