import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ReportedParticipantPage} from "../../../models/user/participant/report/reportedParticipantPage";
import {ReportedParticipant} from "../../../models/user/participant/report/reportedParticipant";
import {ParticipantService} from "../../../services/rallyroundapi/participant.service";
import {Subscription} from "rxjs";
import {
  NgbModal,
  NgbPagination,
  NgbPaginationNext,
  NgbPaginationPages,
  NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";
import {ParticipantResume} from "../../../models/user/participant/participantResume";
import {ParticipantReportsModalComponent} from "../participant-reports-modal/participant-reports-modal.component";

@Component({
  selector: 'rr-reported-participants',
  standalone: true,
  imports: [
    NgbPagination,
    NgbPaginationPrevious,
    NgbPaginationPages,
    NgbPaginationNext
  ],
  templateUrl: './reported-participants.component.html',
  styleUrl: './reported-participants.component.css'
})
export class ReportedParticipantsComponent implements OnInit, OnDestroy {
  private participantService: ParticipantService = inject(ParticipantService);
  private modalService: NgbModal = inject(NgbModal);
  private subs: Subscription = new Subscription();
  reportedParticipantsPage: ReportedParticipantPage = {
    page: 1,
    pageSize: 10,
    totalElements: 1,
    reportedParticipants: []
  } as ReportedParticipantPage;
  actualPage: number = 1;

  ngOnInit(): void {
    this.searchReportedParticipants();
  }

  ngOnDestroy(): void {
  }

  onSelectSpecificPage(p: number) {
    if (this.actualPage != p) {
      this.actualPage = p;
      this.searchReportedParticipants();
    }
  }

  onClickParticipant(participant: ParticipantResume) {
    const modal = this.modalService.open(ParticipantReportsModalComponent, {size: "xl"});
    modal.componentInstance.participant = participant;
  }

  private searchReportedParticipants() {
    this.subs.add(
      this.participantService.getReportedParticipants(this.actualPage).subscribe({
        next: value => {
          this.reportedParticipantsPage = value;
        },
        error: err => {
          console.error(err);
        }
      })
    );
  }
}
