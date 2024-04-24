import {Component, inject, OnInit} from '@angular/core';
import {NavbarComponent, NavBarItem} from "../../shared/navbar/navbar.component";
import {AuthService} from "../../../services/auth/auth.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../shared/alert/alert.component";
import {MPAuthService} from "../../../services/rallyroundapi/mercadopago/mpauth.service";
import {Subscription} from "rxjs";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'rr-participant-home',
  standalone: true,
  imports: [
    NavbarComponent
  ],
  templateUrl: './participant-home.component.html',
  styleUrl: './participant-home.component.css'
})
export class ParticipantHomeComponent implements OnInit {
  username: string = "";
  navbarItems: NavBarItem[] = [];
  private route: ActivatedRoute = inject(ActivatedRoute);
  private authService: AuthService = inject(AuthService);
  private mpAuthService: MPAuthService = inject(MPAuthService);
  private modalService: NgbModal = inject(NgbModal);
  private router: Router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private subs: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => this.username = params['name']
    );

    this.navbarItems = [
      {
        title: "Mi cuenta",
        routerLink: "",
        href: "",
        bootstrapIconClasses: "bi bi-person-square",
        iconInLeftOfTitle: true,
        onClick: undefined
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

  protected readonly matchMedia = matchMedia;
}
