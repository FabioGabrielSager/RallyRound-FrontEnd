import {AbstractControl, FormArray, ValidationErrors} from "@angular/forms";

export function repeatedActivitiesValidator(control: AbstractControl): ValidationErrors | null {
  const formArray = control.get('activities') as FormArray;
  const activityValues: string[] = formArray.controls.map((control: AbstractControl) => control.value.activity);

  const activitySet = new Set(activityValues);

  return activitySet.size === activityValues.length ? null : { duplicateActivities: 'There are duplicate activities.' };
}
