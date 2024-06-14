import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CdkDrag, CdkDragHandle, CdkDropList} from "@angular/cdk/drag-drop";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SearchResultsListComponent} from "../../shared/search-results-list/search-results-list.component";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {TopEventCreators} from "../../../models/user/participant/topEventCreators";
import {TopEventCreator} from "../../../models/user/participant/topEventCreator";
import {ParticipantResume} from "../../../models/user/participant/participantResume";
import {ParticipantService} from "../../../services/rallyroundapi/participant.service";
import {Subscription} from "rxjs";
import {
  ParticipantPublicDataModalComponent
} from "../participant-public-profile/participant-public-data-modal/participant-public-data-modal.component";

@Component({
  selector: 'rr-top-event-creators-modal',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    FormsModule,
    ReactiveFormsModule,
    SearchResultsListComponent,
    DatePipe
  ],
  templateUrl: './top-event-creators-modal.component.html',
  styleUrl: './top-event-creators-modal.component.css'
})
export class TopEventCreatorsModalComponent implements OnInit, OnDestroy{
  private participantService: ParticipantService = inject(ParticipantService);
  private modalService: NgbModal = inject(NgbModal);
  private subs: Subscription = new Subscription();

  isTopInitialized: boolean = false;
  activeModal: NgbActiveModal = inject(NgbActiveModal);
  topEventCreators!: TopEventCreators;
  selectedMonth: number = 0;

  ngOnInit(): void {
    this.loadTop();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadTop() {
    this.subs.add(
      this.participantService.getTopFiveEventCreators(this.selectedMonth).subscribe({
        next: value => {
          this.topEventCreators = value;
          if(!this.isTopInitialized) {
            this.isTopInitialized = true;
          }
        },
        error: err => {
          console.error(err);
        }
      })
    );
  }

  onClickCreator(creatorId: string) {
    const modal = this.modalService.open(ParticipantPublicDataModalComponent, { centered: true, size: "lg" });
    modal.componentInstance.participantId = creatorId;
  }
}
