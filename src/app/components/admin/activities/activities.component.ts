import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  NgbDropdown, NgbDropdownMenu, NgbDropdownToggle,
  NgbPagination,
  NgbPaginationNext,
  NgbPaginationPages,
  NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";
import {ActivityPage} from "../../../models/activity/activityPage";
import {ParticipantResume} from "../../../models/user/participant/participantResume";
import {ParticipantReportsModalComponent} from "../participant-reports-modal/participant-reports-modal.component";
import {RrActivityService} from "../../../services/rallyroundapi/rr-activity.service";
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'rr-activities',
  standalone: true,
  imports: [
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPages,
    NgbPaginationPrevious,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    ReactiveFormsModule
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent implements OnInit, OnDestroy {
  private activityService: RrActivityService = inject(RrActivityService);
  private fb: FormBuilder = inject(FormBuilder);
  private subs: Subscription = new Subscription();
  activityPage: ActivityPage = { page: 1, pageSize: 10, totalElements: 0, activities: [] } as ActivityPage;
  actualPage: number = 1;
  filtersForm: FormGroup;

  constructor() {
    this.filtersForm = this.fb.group({
      name: [""],
      enabled: [""]
    });
  }

  ngOnInit(): void {
    this.searchActivities(undefined, undefined);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSelectSpecificPage(p: number) {
    if (this.actualPage != p) {
      this.actualPage = p;
    }
  }

  onSelectNextPage() {
    this.actualPage = this.actualPage + 1;
  }

  onSelectPreviousPage() {
    this.actualPage = this.actualPage - 1;
  }

  private searchActivities(name: string | undefined, enabled: boolean | undefined) {
    this.subs.add(
      this.activityService.getActivities(name, enabled, this.actualPage).subscribe({
        next: value => this.activityPage = value,
        error: error => {
          console.error(error);
        }
      })
    );
  }

  onSubmit() {
    this.searchActivities(this.filtersForm.controls["name"].value, this.filtersForm.controls["enabled"].value);
  }

  onDisableActivity(activityId: string) {
    this.subs.add(
      this.activityService.disableActivity(activityId).subscribe({
        next: () => this.onSubmit(),
        error: err =>  console.error(err)
      })
    );
  }

  onEnableActivity(activityId: string) {
    this.subs.add(
      this.activityService.enableActivity(activityId).subscribe({
        next: () => this.onSubmit(),
        error: err =>  console.error(err)
      })
    );
  }
}
