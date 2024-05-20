import {Component, EventEmitter, inject, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {combineLatest, startWith, Subscription} from "rxjs";
import {ToastService} from "../../../services/toast.service";
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {repeatedActivitiesValidator} from "../../../validators/repeatedActivitiesValidator";
import {MatchedActivities} from "../../../models/common/MatchedActivities";
import {CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {UserFavoriteActivity} from "../../../models/user/participant/userFavoriteActivity";
import {RrActivityService} from "../../../services/rallyroundapi/rr-activity.service";
import {SearchResultsListComponent} from "../../shared/search-results-list/search-results-list.component";
import {NgClass} from "@angular/common";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'rr-favorite-activities-modal',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDragHandle,
    CdkDropList,
    FormsModule,
    ReactiveFormsModule,
    SearchResultsListComponent,
    NgClass
  ],
  templateUrl: './favorite-activities-modal.component.html',
  styleUrl: './favorite-activities-modal.component.css'
})
export class FavoriteActivitiesModalComponent implements OnInit, OnDestroy {
  activitiesNames: string[] = [];
  actualFocusedActivityControlIndex: number | undefined = undefined;
  private lastAutosuggestedActivitySelected: string = "";
  private subs: Subscription = new Subscription();

  private activityService: RrActivityService = inject(RrActivityService);
  private toastService: ToastService = inject(ToastService);
  activeModal: NgbActiveModal = inject(NgbActiveModal);

  @Output() onConfirmSelection: EventEmitter<UserFavoriteActivity[]> = new EventEmitter();

  private fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({
    activities: this.fb.array([
      this.fb.group({
        activity: ["", [Validators.required]]
      })])
  }, {validators: repeatedActivitiesValidator});

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

  onSubmitSelection() {
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

    this.onConfirmSelection.emit(userFavoritesActivities);
    this.activeModal.close();
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
