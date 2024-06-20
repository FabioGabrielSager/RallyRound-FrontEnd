import {Component, inject, OnInit} from '@angular/core';
import {EventResumeCardComponent} from "../event-resume-card/event-resume-card.component";
import {
  NgbCollapse,
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal,
  NgbModalRef,
  NgbPagination,
  NgbPaginationNext,
  NgbPaginationPages,
  NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";
import {catchError, debounceTime, filter, ObservableInput, of, Subscription, switchMap} from "rxjs";
import {Router, RouterLink} from "@angular/router";
import {AlertComponent} from "../../shared/alert/alert.component";
import {MPAuthService} from "../../../services/rallyroundapi/mercadopago/mpauth.service";
import {ToastService} from "../../../services/toast.service";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {SearchResultsListComponent} from "../../shared/search-results-list/search-results-list.component";
import {NgClass} from "@angular/common";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {EventsResumesPage} from "../../../models/event/EventsResumesPage";
import {
  CreatedEventsInscriptionTrendStatsModalComponent
} from "../created-events-inscription-trend-stats-modal/created-events-inscription-trend-stats-modal.component";
import {MatchedActivities} from "../../../models/common/MatchedActivities";
import {Place} from "../../../models/location/place";
import {RrActivityService} from "../../../services/rallyroundapi/rr-activity.service";
import {MapApiService} from "../../../services/location/map-api.service";

@Component({
  selector: 'rr-my-events',
  standalone: true,
  imports: [
    EventResumeCardComponent,
    NgbCollapse,
    RouterLink,
    ReactiveFormsModule,
    SearchResultsListComponent,
    NgClass,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPages,
    NgbPaginationPrevious,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle
  ],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent implements OnInit {
  private eventService: EventService = inject(EventService);
  private subs: Subscription = new Subscription();
  private mpAuthService: MPAuthService = inject(MPAuthService);
  private modalService: NgbModal = inject(NgbModal);
  private toastService: ToastService = inject(ToastService);
  private activityService: RrActivityService = inject(RrActivityService);
  private mapApiService: MapApiService = inject(MapApiService);
  private router: Router = inject(Router);
  isMyCreatedEventsPageSelected: boolean = false;
  eventsAreLoading: boolean = false;
  events!: EventsResumesPage;
  actualPage: number = 0;
  filtersForm!: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);

  suggestedActivities: string[] = [];
  anActivityWasSelected: boolean = false;
  selectedActivity: string = "";

  formattedNames: string[] = [];
  formattedNamePlaces: Map<string, Place> = new Map<string, Place>([]);
  selectedPlace: Place | undefined = undefined;
  private aLocationWasSelected: boolean = false;

  isFiltersFormCollapsed: boolean = true;

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      activity: [],
      location: [''],
      dateFrom: [new Date().toISOString().split('T')[0]],
      dateTo: [ new Date().toISOString().split('T')[0]],
    });

    // Activities autosuggestion
    this.subs.add(
      this.filtersForm.controls['activity'].valueChanges.pipe(
        debounceTime(300),
        filter(query => query.length >= 3),
        switchMap( (query): ObservableInput<any> => {
          if(query == "" || this.anActivityWasSelected) {
            this.anActivityWasSelected = false;
            return of(null);
          }
          return this.activityService.getMatchedActivities(query).pipe(
            catchError(error => {
              console.error('Error fetching autosuggestions:', error);
              return of(error);
            })
          )
        })
      ).subscribe(
        {
          next: (value: null | MatchedActivities) => {
            this.suggestedActivities = value != null ? value.activities : [];
          }
        }
      )
    );

    // Locations autosuggestion
    this.subs.add(
      this.filtersForm.controls['location'].valueChanges.pipe(
        debounceTime(300),
        filter(query => query.length >= 3),
        switchMap( (query): ObservableInput<any> => {
          if(query == "" || this.aLocationWasSelected) {
            this.aLocationWasSelected = false;
            return of(null);
          }
          return this.mapApiService.getAutosuggestionPlaces(query).pipe(
            catchError(error => {
              console.error('Error fetching autosuggestions:', error);
              return of(error);
            })
          )
        })
      ).subscribe({
        next: (value: null | Place[]) => {
          this.formattedNames = [];
          this.formattedNamePlaces.clear();
          if (value != null) {
            this.selectedPlace = undefined;
            value.forEach((p: Place) => {
              let place: Place = new Place(p.__type, p.address, p.name);
              let formattedName: string = place.getFormattedName();
              this.formattedNames.push(formattedName);
              this.formattedNamePlaces.set(formattedName, p);
            });
          }
        },
        error: err => {
          this.toastService.show("Hubo un error al recuperar lugares, por favor intentelo más tarde.",
            "bg-danger");
          console.error(err);
        }
      })
    );

    this.getMyEvents(
      this.selectedActivity, this.selectedPlace?.address.neighborhood,
      this.selectedPlace?.address.locality, this.selectedPlace?.address.adminDistrict2,
      this.selectedPlace?.address.adminDistrict, this.filtersForm.controls["dateFrom"].value,
      this.filtersForm.controls["dateTo"].value
    );
  }

  onBlurActivityInput() {
    setTimeout(() => {
      this.suggestedActivities = [];
    }, 100)
  }

  onClickActivitySearchResult($event: any) {
    this.anActivityWasSelected = true;
    this.selectedActivity = $event.target.innerText;
  }

  onBlurLocationInput() {
    setTimeout(() => {
      this.formattedNames = [];
      this.formattedNamePlaces.clear();
    }, 200);
  }

  onClickPlaceSearchResult($event: any) {
    this.selectedPlace = this.formattedNamePlaces.get($event.target.innerText);
    this.filtersForm.controls['location'].setValue($event.target.innerText);
    this.aLocationWasSelected = true;
    this.formattedNames = [];
    this.formattedNamePlaces.clear();
  }

  onSelectPage() {
    this.isMyCreatedEventsPageSelected = !this.isMyCreatedEventsPageSelected;
    this.searchEvents();
  }

  searchEvents() {
    if(!this.isMyCreatedEventsPageSelected) {
      this.getMyEvents(this.filtersForm.controls["activity"].value, this.selectedPlace?.address.neighborhood,
        this.selectedPlace?.address.locality, this.selectedPlace?.address.adminDistrict2,
        this.selectedPlace?.address.adminDistrict, this.filtersForm.controls["dateFrom"].value,
        this.filtersForm.controls["dateTo"].value);
    } else {
      this.getMyCreatedEvents(
        this.filtersForm.controls["activity"].value, this.selectedPlace?.address.neighborhood,
        this.selectedPlace?.address.locality, this.selectedPlace?.address.adminDistrict2,
        this.selectedPlace?.address.adminDistrict, this.filtersForm.controls["dateFrom"].value,
        this.filtersForm.controls["dateTo"].value
      );
    }

    this.actualPage = this.events.page;
  }

  private getMyEvents(activity: string | undefined, neighborhood: string | undefined,
                      locality: string | undefined, adminSubdistrict: string | undefined, adminDistrict: string | undefined,
                      dateFrom: string | null, dateTo: string | null) {
    // TODO: Add the required filters for this parameters
    this.eventsAreLoading = true;
    this.eventService.getCurrentUserParticipatingEvents(null, null, null,
      activity, neighborhood, locality,
      adminSubdistrict, adminDistrict, dateFrom, dateTo, []).subscribe(
      {
        next: value => {
          this.events = value;
          this.eventsAreLoading = false;
        },
        error: err => {
          this.eventsAreLoading = false;
          console.error(err);
        }
      }
    );
  }

  private getMyCreatedEvents(activity: string | undefined, neighborhood: string | undefined, locality: string | undefined,
                             adminSubdistrict: string | undefined, adminDistrict: string | undefined, dateFrom: string | null,
                             dateTo: string | null) {
    // TODO: Add the required filters for this parameters
    this.eventsAreLoading = true;
    this.eventService.getCurrentUserCreatedEvents(activity, neighborhood, locality,
      adminSubdistrict, adminDistrict, dateFrom, dateTo, []).subscribe(
      {
        next: value => {
          this.events = value;
          this.eventsAreLoading = false;
        },
        error: err => {
          this.eventsAreLoading = false;
          console.error(err);
        }
      }
    );
  }

  onSelectSpecificPage(p: number) {
    if(this.actualPage != p) {
      this.actualPage = p;
      this.searchEvents();
    }
  }

  onSelectNextPage() {
    this.actualPage = this.actualPage + 1;
    this.searchEvents();
  }

  onSelectPreviousPage() {
    this.actualPage = this.actualPage - 1;
    this.searchEvents();
  }

  onSeeEvent(eventId: string) {
    if(this.isMyCreatedEventsPageSelected) {
      this.subs.add(
        this.eventService.getCurrentUserCreatedEvent(eventId).subscribe({
          next: () => {
            this.router.navigate(['events', { outlets: { events: ['myevents', eventId]}}]);
          },
          error: err => {
            this.toastService.show("Hubo un error al intentar recuperar el evento.", "bg-danger");
            console.error(err);
          }
        })
      )
    } else {
      this.subs.add(
        this.eventService.getCurrentUserParticipatingEvent(eventId).subscribe(
          {
            next: () => {
              this.router.navigate([ 'events', { outlets: { events: ['myevents', eventId]}}]);
            },
            error: err => {
              this.toastService.show("Hubo un error al intentar recuperar el evento.", "bg-danger");
              console.log(err);
            }
          }
        )
      );
    }
  }

  // TODO: Check if this duplicate code can be avoided
  onCreateEvent() {
    this.subs.add(
      this.mpAuthService.isAccountLinked().subscribe({
        next: (result) => {
          if (!result) {
            const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: 'lg'});
            modal.componentInstance.isAConfirm = true;
            modal.componentInstance.title = "Vincular mercado pago";
            modal.componentInstance.bodyString = {
              textParagraphs: [
                "Para crear un evento primero debes vincular tu cuenta de mercado pago.",
                "¿Quieres vincular tu cuenta de mercado pago?"
              ]
            };
            modal.componentInstance.confirmBehavior = () => {
              this.subs.add(
                this.mpAuthService.getAuthUrl().subscribe({
                  next: (url: string) => {
                    const width = 600;
                    const height = 800;
                    const left = window.innerWidth / 2 - width / 2;
                    const top = window.innerHeight / 2 - height / 2;
                    const features =
                      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;
                    window.open(url, '_blank', features);
                  },
                  error: err => {
                    this.toastService.show("Hubo un error al intentar recuperar la dirección de autenticación " +
                      "de mercado pago, por favor inténtelo más tarde.", "bg-danger");
                  }
                })
              );
            }
          } else {
            this.router.navigate(['/events/', {outlets: {events: ['create']}}]);
          }
        },
        error: err => {
          this.toastService.show("Hubo un error al intentar verificar su vinculación con mercado pago, " +
            "por favor inténtelo más tarde.", "bg-danger");
        }
      })
    );
  }

  onClickInscriptionsTrend() {
    this.modalService.open(CreatedEventsInscriptionTrendStatsModalComponent, {size: "xl"})
  }
}
