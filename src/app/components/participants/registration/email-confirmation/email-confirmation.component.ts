import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {ActivatedRoute, Params} from "@angular/router";
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
  private userId: string = "";
  private route: ActivatedRoute = inject(ActivatedRoute);
  private subs: Subscription = new Subscription();
  private authService: AuthService = inject(AuthService);

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => this.userId = params['userId']
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onResendToken() {
    this.subs.add(
      this.authService.refreshEmailVerificationToken(this.userId).subscribe()
    );
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.get('codeInput')?.markAsTouched();
      return;
    }

    this.subs.add(
      this.authService.sendRegistrationConfirmation(this.userId, form.control.get('codeInput')?.value)
        .subscribe(
          {
            next: value => {
              // TODO: Redirects to the user home.
            },
            // TODO: ADD A TOAST TO INFORM ABOUT THE ERROR
            error: err => console.error(err)
          }
        )
    );
  }
}
