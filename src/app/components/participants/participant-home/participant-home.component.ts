import {Component, inject, OnInit} from '@angular/core';
import {NavbarComponent, NavBarItem} from "../../shared/navbar/navbar.component";
import {AuthService} from "../../../services/auth/auth.service";
import {ActivatedRoute, Params} from "@angular/router";

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
        onClick: () => this.authService.logout(),
      }
    ]
  }

  protected readonly matchMedia = matchMedia;
}
