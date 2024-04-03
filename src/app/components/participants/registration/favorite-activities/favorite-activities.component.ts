import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CdkDragDrop, DragDropModule, moveItemInArray} from "@angular/cdk/drag-drop";
import {UserFavoriteActivity} from "../../../../models/user/userFavoriteActivity";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'rr-favorite-activities',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragDropModule
  ],
  templateUrl: './favorite-activities.component.html',
  styleUrl: './favorite-activities.component.css'
})
export class FavoriteActivitiesComponent {
  private fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    activities: this.fb.array([
      this.fb.group({
        activity: ["", [Validators.required]]
      })
    ])
  })
  private authService: AuthService = inject(AuthService);

  get activitiesFormArray() {
    return this.form.controls['activities'] as FormArray;
  }

  addActivity() {
    this.activitiesFormArray.push(this.fb.group({
      activity: ["", [Validators.required]]
    }));
  }

  deleteActivity(i: number) {
    this.activitiesFormArray.removeAt(i);
  }

  onDrop($event: CdkDragDrop<any, any>) {
    moveItemInArray(this.activitiesFormArray.controls, $event.previousIndex, $event.currentIndex);
  }

  onSubmit() {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let userFavoritesActivities: UserFavoriteActivity[] = [];

    for(let i: number=0; i < this.activitiesFormArray.length; i++) {
      userFavoritesActivities.push({
        name: this.activitiesFormArray.controls[i].get('activity')?.value,
        order: i
      })
    }

    this.authService.setParticipantRegistrationRequestActivities(userFavoritesActivities);
  }
}
