import {Component, inject, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {passwordMatchValidator} from "../../../validators/passwordMatchValidator";
import {LoginRequest} from "../../../models/user/loginRequest";
import {AuthService} from "../../../services/auth/auth.service";
import {Subscription} from "rxjs";
import {ToastService} from "../../../services/toast.service";
import {Router, RouterLink} from "@angular/router";
import {NavbarComponent} from "../navbar/navbar.component";

@Component({
  selector: 'rr-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NavbarComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy{
  passwordIsHide: boolean = true;
  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    username: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(5)]]
  });
  private toastService: ToastService = inject(ToastService);
  private authService: AuthService = inject(AuthService);
  private loginSub: Subscription = new Subscription();
  private router: Router = inject(Router);

  togglePasswordVisibility() {
    this.passwordIsHide = !this.passwordIsHide;
  }

  onSubmit() {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let loginRequest: LoginRequest = new
    LoginRequest(this.form.controls['username'].value, this.form.controls['password'].value);

    this.loginSub = this.authService.login(loginRequest).subscribe(
      {
        next: username => {
          // Redirects to user home
          this.router.navigate(["/participant/home/" + username]);
        },
        error: err => {
          if(err.status === 403) {
            this.toastService.show("Dirección de correo y/o la contraseña incorrectas.", "bg-danger");
          } else {
            this.toastService.show("Hubo un error al intentar iniciar sesión, por favor inténtelo más tarde.",
              "bg-danger");
          }
          console.error(err);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.loginSub.unsubscribe();
  }
}
