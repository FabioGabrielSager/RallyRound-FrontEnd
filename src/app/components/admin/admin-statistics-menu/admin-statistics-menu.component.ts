import {Component, inject} from '@angular/core';
import {HasPrivilegeDirective} from "../../../directive/has-privilege.directive";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  TopEventCreatorsModalComponent
} from "../../participants/top-event-creators-modal/top-event-creators-modal.component";
import {
  EventsForActivityStatisticsModalComponent
} from "../../events/events-for-activity-statistics-modal/events-for-activity-statistics-modal.component";
import {
  EventsFeeStatisticsModalComponent
} from "../../events/events-fee-statistics-modal/events-fee-statistics-modal.component";
import {
  EventsInscriptionTrendByYearModalComponent
} from "../../events/events-inscription-trend-by-year-modal/events-inscription-trend-by-year-modal.component";
import {
  ReportsStatisticsModalComponent
} from "../../participants/reports-statistics-modal/reports-statistics-modal.component";

@Component({
  selector: 'rr-admin-statistics-menu',
  standalone: true,
    imports: [
        HasPrivilegeDirective
    ],
  templateUrl: './admin-statistics-menu.component.html',
  styleUrl: './admin-statistics-menu.component.css'
})
export class AdminStatisticsMenuComponent {
  private modalService: NgbModal = inject(NgbModal);

  onClickTopCreators() {
    this.modalService.open(TopEventCreatorsModalComponent, {centered: true, size: "lg"})
  }

  onClickEventTrend() {
    this.modalService.open(EventsForActivityStatisticsModalComponent, {size: "xl", centered: true})
  }

  onClickEventFeeStats() {
    this.modalService.open(EventsFeeStatisticsModalComponent, {size: "xl", centered: true})
  }

  onClickInscriptionTrend() {
    this.modalService.open(EventsInscriptionTrendByYearModalComponent, {size: "xl", centered: true})
  }

  onClickUserReportsStats() {
    this.modalService.open(ReportsStatisticsModalComponent, {size: "xl", centered: true})
  }
}
