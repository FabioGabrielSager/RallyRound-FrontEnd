import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value === confirmPassword.value ? null : { passwordMatch: true };
}
