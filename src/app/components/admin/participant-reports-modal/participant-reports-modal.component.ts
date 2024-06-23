import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {
  NgbActiveModal,
  NgbPagination,
  NgbPaginationNext,
  NgbPaginationPages,
  NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";
import {ReportResponse} from "../../../models/user/participant/report/reportResponse";
import {ReportMotiveMessages} from "../../../models/user/participant/report/reportMotiveMessages";
import {ParticipantResume} from "../../../models/user/participant/participantResume";
import {ParticipantService} from "../../../services/rallyroundapi/participant.service";
import {Subscription} from "rxjs";
import {ParticipantReportsPage} from "../../../models/user/participant/report/participantReportsPage";

@Component({
  selector: 'rr-participant-reports-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPages,
    NgbPaginationPrevious
  ],
  templateUrl: './participant-reports-modal.component.html',
  styleUrl: './participant-reports-modal.component.css'
})
export class ParticipantReportsModalComponent implements OnInit, OnDestroy {
  private participantService: ParticipantService = inject(ParticipantService);
  private subs: Subscription = new Subscription();

  activeModal: NgbActiveModal = inject(NgbActiveModal);
  @Input() participant!: ParticipantResume;
  reportsPage: ParticipantReportsPage = { page: 1, pageSize: 10, totalElements: 0, reports: [] } as ParticipantReportsPage;
  reportMotivesMessages = ReportMotiveMessages;
  actualPage: number = 1;

  ngOnInit(): void {
    this.getParticipantReports();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSelectSpecificPage(p: number) {
    if (this.actualPage != p) {
      this.actualPage = p;
      this.getParticipantReports();
    }
  }

  onDeleteReport(reportId: string) {
    this.subs.add(
      this.participantService.deleteParticipantReport(reportId).subscribe(
        {
          next: () => {
            this.getParticipantReports();
          },
          error: err => console.error(err)
        }
      )
    );
  }

  private getParticipantReports() {
    this.subs.add(
      this.participantService.getParticipantReports(this.participant.id, this.actualPage).subscribe({
        next: value => {
          this.reportsPage = value;
        },
        error: error => {
          console.error(error);
        }
      })
    );
  }
}
