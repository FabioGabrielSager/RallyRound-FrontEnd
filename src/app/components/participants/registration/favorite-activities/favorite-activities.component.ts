import {Component, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CdkDragDrop, DragDropModule, moveItemInArray} from "@angular/cdk/drag-drop";
import {UserFavoriteActivity} from "../../../../models/user/userFavoriteActivity";
import {AuthService} from "../../../../services/auth.service";
import {RrActivityService} from "../../../../services/rr-activity.service";
import {catchError, combineLatest, debounceTime, filter, of, startWith, Subscription, switchMap} from "rxjs";
import {MatchedActivities} from "../../../../models/common/MatchedActivities";
import {NgClass} from "@angular/common";
import {repeatedActivitiesValidator} from "../../../../validators/repeatedActivitiesValidator";
import {Router} from "@angular/router";

@Component({
  selector: 'rr-favorite-activities',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    NgClass
  ],
  templateUrl: './favorite-activities.component.html',
  styleUrl: './favorite-activities.component.css'
})
export class FavoriteActivitiesComponent implements OnInit, OnDestroy {
  private authService: AuthService = inject(AuthService);
  activitiesNames: string[] = [];
  actualFocusedActivityControlIndex: number | undefined = undefined;
  private lastAutosuggestedActivitySelected: string = "";
  private subs: Subscription = new Subscription();
  private fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    activities: this.fb.array([
      this.fb.group({
        activity: ["", [Validators.required]]
      })])
  }, {validators: repeatedActivitiesValidator});

  private router: Router = inject(Router);

  constructor(private activityService: RrActivityService) {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  ngOnInit(): void {
    this.subs.add(
      combineLatest([this.activitiesFormArray.valueChanges,
        this.activitiesFormArray.valueChanges.pipe(startWith(null))]
      ).subscribe(([values, previousValues]) => {
        if (!previousValues) return; // Skip the initial emission

        values.forEach((control: any, index: number) => {
          if (values[index] !== previousValues[index]) {
            this.actualFocusedActivityControlIndex = index;
            if (control.activity !== "" && this.lastAutosuggestedActivitySelected !== control.activity) {
              this.subs.add(
                this.activityService.getMatchedActivities(control.activity)
                  .subscribe({
                    next: (value: MatchedActivities) => {
                      this.activitiesNames = value.activities;
                    },
                    error: err => {
                      console.error(err)
                    }
                  })
              );
            }
          }
        });
      })
    );
  }

  get activitiesFormArray() {
    return this.form.controls['activities'] as FormArray;
  }

  addActivity() {
    let lastAddedActivityControl =
      this.activitiesFormArray.controls[this.activitiesFormArray.length - 1]
        .get('activity');
    if (!lastAddedActivityControl?.hasError('required')) {
      this.activitiesFormArray.push(this.fb.group({
        activity: ["", [Validators.required]]
      }));
    } else {
      lastAddedActivityControl?.markAsTouched();
    }
  }

  deleteActivity(i: number) {
    this.activitiesFormArray.removeAt(i);
  }

  onDrop($event: CdkDragDrop<any, any>) {
    moveItemInArray(this.activitiesFormArray.controls, $event.previousIndex, $event.currentIndex);
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let userFavoritesActivities: UserFavoriteActivity[] = [];

    for (let i: number = 0; i < this.activitiesFormArray.length; i++) {
      userFavoritesActivities.push({
        name: this.activitiesFormArray.controls[i].get('activity')?.value,
        order: i
      })
    }

    this.authService.setParticipantRegistrationRequestActivities(userFavoritesActivities);
    this.subs.add(
      this.authService.sendRegistrationRequest().subscribe(
        {
          next: value => {
            this.router.navigate(["participant/account/confirmEmail/" + value.userId]);
          },
          error: err => console.error(err)
        }
      )
    );
  }

  onClickSearchResult($event: any, i: number) {
    this.activitiesFormArray.controls[i].get('activity')?.setValue($event.target.innerText);
    this.lastAutosuggestedActivitySelected = $event.target.innerText;
    this.activitiesNames = [];
  }

  onFocus(autosuggestionLocalities: HTMLDivElement) {
    autosuggestionLocalities.classList.add('d-block')
  }

  onBlur(autosuggestionLocalities: HTMLDivElement) {
    setTimeout(() => {
      autosuggestionLocalities.classList.add('d-none');
      this.activitiesNames = [];
    }, 200);
  }
}
