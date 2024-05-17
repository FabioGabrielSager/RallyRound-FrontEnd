import {Component, OnDestroy} from '@angular/core';
import {NavigationStart, Router, RouterOutlet} from '@angular/router';
import {ToastContainerComponent} from "./components/shared/toast-container/toast-container.component";
import {Subscription} from "rxjs";

export let browserRefresh = false;

@Component({
  selector: 'rr-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  title = 'RallyRound-FrontEnd';
  subscription: Subscription;

  constructor(private router: Router) {
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        browserRefresh = !router.navigated;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
