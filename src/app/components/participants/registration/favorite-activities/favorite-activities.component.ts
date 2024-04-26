import {Component, Inject, inject, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CdkDragDrop, DragDropModule, moveItemInArray} from "@angular/cdk/drag-drop";
import {UserFavoriteActivity} from "../../../../models/user/participant/userFavoriteActivity";
import {AuthService} from "../../../../services/auth/auth.service";
import {RrActivityService} from "../../../../services/rallyroundapi/rr-activity.service";
import {catchError, combineLatest, debounceTime, filter, of, startWith, Subscription, switchMap} from "rxjs";
import {MatchedActivities} from "../../../../models/common/MatchedActivities";
import {NgClass} from "@angular/common";
import {repeatedActivitiesValidator} from "../../../../validators/repeatedActivitiesValidator";
import {Router} from "@angular/router";
import {ToastService} from "../../../../services/toast.service";
import {SearchResultsListComponent} from "../../../shared/search-results-list/search-results-list.component";

@Component({
  selector: 'rr-favorite-activities',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    NgClass,
    SearchResultsListComponent
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

  private toastService: ToastService = inject(ToastService);

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

  ngOnInit(): void {
    // Activities autosuggestion
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
                      this.toastService.show("Hubo un error al recuperar actividades registradas.",
                        "bg-danger");
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
            this.router.navigate(['/participant/register/',
                {
                  outlets: {
                    registration: ['confirmEmail', {userEmail: value.userEmail}]
                  }
                }
              ]
            );
          },
          error: err => {
            this.toastService.show("Hubo un error al enviar la solicitud de registro, por favor inténtelo más tarde.",
              "bg-danger");
            console.error(err);
          }
        }
      )
    );
  }

  onClickSearchResult($event: any, i: number) {
    this.activitiesFormArray.controls[i].get('activity')?.setValue($event.target.innerText);
    this.lastAutosuggestedActivitySelected = $event.target.innerText;
    this.activitiesNames = [];
  }

  onBlur() {
    setTimeout(() => {
      this.activitiesNames = [];
    }, 200);
  }
}
