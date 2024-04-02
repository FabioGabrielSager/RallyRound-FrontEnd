import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {PersonalInfoComponent} from "./components/participants/registration/personal-info/personal-info.component";

@Component({
  selector: 'rr-root',
  standalone: true,
  imports: [RouterOutlet, PersonalInfoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RallyRound-FronEnd';
}
