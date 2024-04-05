import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ToastContainerComponent} from "./components/shared/toast-container/toast-container.component";

@Component({
  selector: 'rr-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'RallyRound-FronEnd';
}
