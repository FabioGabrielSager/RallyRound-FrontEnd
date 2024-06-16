import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NavbarComponent, NavBarItem} from "../../shared/navbar/navbar.component";
import {AuthService} from "../../../services/auth/auth.service";
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../shared/alert/alert.component";
import {MPAuthService} from "../../../services/rallyroundapi/mercadopago/mpauth.service";
import {Subscription} from "rxjs";
import {ToastService} from "../../../services/toast.service";
import {
  ParticipantEventsNotificationsModalComponent
} from "../participant-events-notifications-modal/participant-events-notifications-modal.component";
import {
  ParticipantEventNotificationDto
} from "../../../models/user/participant/notification/participantEventNotificationDto";
import {ParticipantNotificationService} from "../../../services/rallyroundapi/participant-notification.service";
import {TopEventCreatorsModalComponent} from "../top-event-creators-modal/top-event-creators-modal.component";
import {
  EventsForActivityStatisticsModalComponent
} from "../../events/events-for-activity-statistics-modal/events-for-activity-statistics-modal.component";

@Component({
  selector: 'rr-participant-home',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterLink
  ],
  templateUrl: './participant-home.component.html',
  styleUrl: './participant-home.component.css'
})
export class ParticipantHomeComponent implements OnInit, OnDestroy {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private authService: AuthService = inject(AuthService);
  private mpAuthService: MPAuthService = inject(MPAuthService);
  private modalService: NgbModal = inject(NgbModal);
  private router: Router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private notificationService: ParticipantNotificationService = inject(ParticipantNotificationService);
  private subs: Subscription = new Subscription();
  username: string = "";
  navbarItems: NavBarItem[] = [];
  userNotifications: ParticipantEventNotificationDto[] = [];

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.notificationService.disconnectFromTheNotificationTray();
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
        onClick: () => {
          this.router.navigate(["/participant/account"])
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

    this.subs.add(
      this.notificationService.getCurrentUserNotifications().subscribe({
        next: notifications => {
          this.userNotifications = notifications;
        },
        error: err => console.error(err)
      })
    );

    this.subs.add(
      this.notificationService.connectToCurrentUserNotificationTray().subscribe({
        next: notification => {
          this.userNotifications.push(JSON.parse(notification.body));
        }
      })
    );
  }

  onCreateEvent() {
    this.subs.add(
      this.mpAuthService.isAccountLinked().subscribe({
        next: (result) => {
          if (!result) {
            const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: 'lg'});
            modal.componentInstance.isAConfirm = true;
            modal.componentInstance.title = "Vincular mercado pago";
            modal.componentInstance.bodyString = {
              textParagraphs: [
                "Para crear un evento primero debes vincular tu cuenta de mercado pago.",
                "¿Quieres vincular tu cuenta de mercado pago?"
              ]
            };
            modal.componentInstance.confirmBehavior = () => {
              this.subs.add(
                this.mpAuthService.getAuthUrl().subscribe({
                  next: (url: string) => {
                    const width = 600;
                    const height = 800;
                    const left = window.innerWidth / 2 - width / 2;
                    const top = window.innerHeight / 2 - height / 2;
                    const features =
                      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;
                    window.open(url, '_blank', features);
                  },
                  error: err => {
                    this.toastService.show("Hubo un error al intentar recuperar la dirección de autenticación " +
                      "de mercado pago, por favor inténtelo más tarde.", "bg-danger");
                  }
                })
              );
            }
          } else {
            this.router.navigate(['/events/', { outlets: { events: ['create']}}]);
          }
        },
        error: err => {
          this.toastService.show("Hubo un error al intentar verificar su vinculación con mercado pago, " +
            "por favor inténtelo más tarde.", "bg-danger");
        }
      })
    );
  }

  onShowNotifications() {
     const modal: NgbModalRef = this.modalService.open(ParticipantEventsNotificationsModalComponent,
      { centered: true, size: 'lg', scrollable: true });

     modal.componentInstance.notifications = this.userNotifications;
  }

  onClickTopCreators() {
    this.modalService.open(TopEventCreatorsModalComponent, {centered: true, size: "lg"})
  }

  onClickEventTrend() {
    this.modalService.open(EventsForActivityStatisticsModalComponent, {size: "xl", centered: true})
  }
}
