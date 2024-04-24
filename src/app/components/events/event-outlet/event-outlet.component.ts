import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NavbarComponent, NavBarItem} from "../../shared/navbar/navbar.component";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../shared/alert/alert.component";
import {ActivatedRoute, Router, RouterOutlet} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {Location} from "@angular/common";

@Component({
  selector: 'rr-event-outlet',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './event-outlet.component.html',
  styleUrl: './event-outlet.component.css'
})
export class EventOutletComponent implements OnInit {
  navbarItems: NavBarItem[] = [];
  private location: Location = inject(Location);
  private router: Router = inject(Router);
  private modalService: NgbModal = inject(NgbModal);
  private authService: AuthService = inject(AuthService);


  ngOnInit(): void {
    this.navbarItems = [
      {
        title: "",
        routerLink: "",
        href: "",
        bootstrapIconClasses: "bi bi-arrow-return-left",
        iconInLeftOfTitle: true,
        onClick: () => { this.location.back(); }
      },
      {
        title: "Salir",
        routerLink: "",
        href: "",
        bootstrapIconClasses: "bi bi-box-arrow-right",
        iconInLeftOfTitle: false,
        onClick: () => {
          const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: "sm"});
          modal.componentInstance.isAConfirm = true;
          modal.componentInstance.title = "Salir";
          modal.componentInstance.bodyString = {textParagraphs: ["Seguro que quieres salir de RallyRound?"]};
          modal.componentInstance.confirmBehavior = () => {
            this.authService.logout();
            this.router.navigate(["/home"])
          }
        },
      }
    ];
  }
}
