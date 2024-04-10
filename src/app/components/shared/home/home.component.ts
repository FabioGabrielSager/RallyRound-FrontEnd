import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {NavbarComponent} from "../navbar/navbar.component";

@Component({
  selector: 'rr-home',
  standalone: true,
    imports: [
        RouterLink,
        NavbarComponent,
        RouterOutlet
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
