import {Component, inject, Input} from '@angular/core';
import {UserPublicProfileComponent} from "../user-public-profile/user-public-profile.component";
import {NgbActiveModal, NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {ReportParticipantModalComponent} from "../../report-participant-modal/report-participant-modal.component";

@Component({
  selector: 'rr-participant-public-data-modal',
  standalone: true,
    imports: [
        UserPublicProfileComponent
    ],
  templateUrl: './participant-public-data-modal.component.html',
  styleUrl: './participant-public-data-modal.component.css'
})
export class ParticipantPublicDataModalComponent {
  private modalService: NgbModal = inject(NgbModal);
  activeModal: NgbActiveModal = inject(NgbActiveModal);
  @Input() participantId: string = "";


  onReportUserClick() {
    const modal: NgbModalRef = this.modalService.open(ReportParticipantModalComponent, { centered: true});
    modal.componentInstance.reportedUserId = this.participantId;
  }
}
