import {Component, inject, OnInit} from '@angular/core';
import {NavbarComponent, NavBarItem} from "../../shared/navbar/navbar.component";
import {Router, RouterOutlet} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../shared/alert/alert.component";
import {Location} from "@angular/common";

@Component({
  selector: 'rr-admin-outlet',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet
  ],
  templateUrl: './admin-outlet.component.html',
  styleUrl: './admin-outlet.component.css'
})
export class AdminOutletComponent implements OnInit {
  navbarItems: NavBarItem[] = [];
  private authService: AuthService = inject(AuthService);
  private modalService: NgbModal = inject(NgbModal);
  private router: Router = inject(Router);
  private location: Location = inject(Location);

  ngOnInit(): void {
    this.navbarItems = [
      {
        title: "",
        routerLink: "",
        href: "",
        bootstrapIconClasses: "bi bi-arrow-return-left",
        iconInLeftOfTitle: true,
        onClick: () => {
          this.location.back();
        }
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
