import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router, RouterLink, RouterOutlet} from "@angular/router";
import {NavbarComponent, NavBarItem} from "../../shared/navbar/navbar.component";
import {AuthService} from "../../../services/auth/auth.service";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../shared/alert/alert.component";
import {HasPrivilegeDirective} from "../../../directive/has-privilege.directive";

@Component({
  selector: 'rr-admin-home',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    RouterOutlet,
    HasPrivilegeDirective
  ],
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit {
  username: string = "";
  navbarItems: NavBarItem[] = [];
  private authService: AuthService = inject(AuthService);
  private modalService: NgbModal = inject(NgbModal);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => this.username = params['name']
    );

    this.navbarItems = [
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
