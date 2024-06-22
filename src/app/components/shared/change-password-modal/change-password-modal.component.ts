import {Component, inject, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../services/auth/auth.service";
import {Subscription} from "rxjs";
import {PasswordChangeRequest} from "../../../models/user/participant/passwordChangeRequest";
import {ToastService} from "../../../services/toast.service";
import {passwordMatchValidator} from "../../../validators/passwordMatchValidator";

@Component({
  selector: 'rr-change-password-modal',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css'
})
export class ChangePasswordModalComponent implements OnDestroy {
  private authService: AuthService = inject(AuthService);
  private toastService: ToastService = inject(ToastService);
  private subs: Subscription = new Subscription();
  activeModal: NgbActiveModal = inject(NgbActiveModal);
  form: FormGroup;
  passwordIsHide: boolean = true;
  newPasswordIsHide: boolean = true;
  confirmPasswordIsHide: boolean = true;

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      oldPassword: ["", [Validators.required, Validators.minLength(5)]],
      password: ["", [Validators.required, Validators.minLength(5)]],
      confirmPassword: ["", [Validators.required]]
    }, {validators: passwordMatchValidator});
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  togglePasswordVisibility() {
    this.passwordIsHide = !this.passwordIsHide;
  }

  toggleNewPasswordVisibility() {
    this.newPasswordIsHide = !this.newPasswordIsHide;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordIsHide = !this.confirmPasswordIsHide;
  }

  onChangePassword() {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request = new PasswordChangeRequest(this.form.controls["oldPassword"].value,
      this.form.controls["password"].value);

    this.subs.add(
      this.authService.changePassword(request).subscribe({
        next: username => {
          this.toastService.show("Contraseña actualizada con éxito", "bg-success");
          this.activeModal.dismiss();
        },
        error: err => {
          if (err.status == 403) {
            this.toastService.show("Error: Contraseña no valida.", "bg-danger");
          } else {
            this.toastService.show("Hubo un error al intentar actualizar la contraseña.",
              "bg-danger");
          }
        }
      })
    );
  }
}
