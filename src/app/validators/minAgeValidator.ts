import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function minAgeValidator(minimumAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const birthdate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();

    if (today.getMonth() < birthdate.getMonth() ||
      (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate())) {
      // Subtract 1 if the birth month is after the current month or if it's the same month but the birthday
      // hasn't happened yet
      age--;
    }

    return age >= minimumAge ? null : { minimumAge: true };
  };
}
