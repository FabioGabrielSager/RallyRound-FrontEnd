import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {AuthService} from "../../../../services/auth/auth.service";

@Component({
  selector: 'rr-email-confirmation',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css'
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {
  verificationCode: number | undefined = undefined;
  private userEmail: string = "";
  private route: ActivatedRoute = inject(ActivatedRoute);
  private subs: Subscription = new Subscription();
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => this.userEmail = params['userEmail']
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onResendToken() {
    this.subs.add(
      this.authService.refreshEmailVerificationToken(this.userEmail).subscribe()
    );
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.get('codeInput')?.markAsTouched();
      return;
    }

    this.subs.add(
      this.authService.sendRegistrationConfirmation(this.userEmail, form.control.get('codeInput')?.value)
        .subscribe(
          {
            next: username => {
              // Redirects to the user home.
              this.router.navigate(["/participant/home/" + username]);
            },
            // TODO: ADD A TOAST TO INFORM ABOUT THE ERROR
            error: err => console.error(err)
          }
        )
    );
  }
}
