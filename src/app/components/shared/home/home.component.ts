import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {NavbarComponent} from "../navbar/navbar.component";
import {FooterComponent} from "../footer/footer.component";

@Component({
  selector: 'rr-home',
  standalone: true,
    imports: [
        RouterLink,
        NavbarComponent,
        RouterOutlet,
        FooterComponent
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {}
