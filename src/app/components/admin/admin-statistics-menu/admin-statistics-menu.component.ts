import {Component, inject} from '@angular/core';
import {HasPrivilegeDirective} from "../../../directive/has-privilege.directive";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {
  TopEventCreatorsModalComponent
} from "../../participants/top-event-creators-modal/top-event-creators-modal.component";

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
}
