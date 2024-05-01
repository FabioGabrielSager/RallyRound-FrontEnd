import {Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SearchResultsListComponent} from "../../shared/search-results-list/search-results-list.component";
import {DatePipe, NgClass} from "@angular/common";
import {catchError, debounceTime, filter, ObservableInput, of, Subscription, switchMap} from "rxjs";
import {MatchedActivities} from "../../../models/common/MatchedActivities";
import {RrActivityService} from "../../../services/rallyroundapi/rr-activity.service";
import {
  NgbCollapse,
  NgbCollapseModule,
  NgbPagination,
  NgbPaginationNext,
  NgbPaginationPages,
  NgbPaginationPrevious,
  NgbTooltip
} from "@ng-bootstrap/ng-bootstrap";
import {Place} from "../../../models/location/place";
import {MapApiService} from "../../../services/location/map-api.service";
import {ToastService} from "../../../services/toast.service";
import {HourPipe} from "../../../pipe/hour.pipe";
import {EventsResumesPage} from "../../../models/event/EventsResumesPage";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {Address} from "../../../models/location/address";
import {NavbarComponent} from "../../shared/navbar/navbar.component";
import {
  EventDetailsPublicComponentComponent
} from "../event-details-public-component/event-details-public-component.component";

@Component({
  selector: 'rr-event-search',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SearchResultsListComponent,
    NgClass,
    NgbTooltip,
    HourPipe,
    NgbPagination,
    NgbPaginationPages,
    NgbPaginationNext,
    NgbPaginationPrevious,
    NgbCollapseModule,
    DatePipe,
    NavbarComponent,
    EventDetailsPublicComponentComponent
  ],
  templateUrl: './event-search.component.html',
  styleUrl: './event-search.component.css'
})
export class EventSearchComponent implements OnInit{
  private fb: FormBuilder = inject(FormBuilder);
  private subs: Subscription = new Subscription();
  private searchEventSub: Subscription = new Subscription();
  private activityService: RrActivityService = inject(RrActivityService);
  private mapApiService: MapApiService = inject(MapApiService);
  private toastService: ToastService = inject(ToastService);
  private eventService: EventService = inject(EventService);

  eventsResumesPage: EventsResumesPage = { } as EventsResumesPage;
  actualPage: number = 1;
  selectedEventId: string = "";

  suggestedActivities: string[] = [];
  anActivityWasSelected: boolean = false;
  selectedActivity: string = "";

  formattedNames: string[] = [];
  formattedNamePlaces: Map<string, Place> = new Map<string, Place>([]);
  selectedPlace: Place | undefined = undefined;
  private aLocationWasSelected: boolean = false;

  form: FormGroup = this.fb.group({});

  hours: string[] = [];
  addingHour: boolean = false;

  isSearchFormCollapsed: boolean = false;
  eventDetailsContainerClasses: string = "";
  @ViewChild('resultsContainer') resultsContainer!: ElementRef<HTMLDivElement>;

  protected readonly Array = Array;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateEventDetailsContainerClasses();
  }

  ngOnInit(): void {

    this.form = this.fb.group(
      {
        activity: [],
        location: [''],
        dateFrom: [],
        dateTo: []
      }
    );

    // Activities autosuggestion
    this.subs.add(
      this.form.controls['activity'].valueChanges.pipe(
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
      this.form.controls['location'].valueChanges.pipe(
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
    this.form.controls['location'].setValue($event.target.innerText);
    this.aLocationWasSelected = true;
    this.formattedNames = [];
    this.formattedNamePlaces.clear();
  }

  toggleAddHourInput() {
    this.addingHour = !this.addingHour;
  }

  onAddNewHour(hourInput: HTMLInputElement) {
    if(!this.hours.some(hour => hour === hourInput.value) && hourInput.value !== '') {
      this.hours.push(hourInput.value);
      hourInput.value = '';
    }
  }

  onRemoveHour(i: number) {
    this.hours.splice(i, 1);
  }

  onViewEventClick(eventId: string) {
    this.selectedEventId = eventId;
    this.updateEventDetailsContainerClasses();
  }

  onSubmitSearch() {
    this.actualPage = 1;
    this.searchEvents();
    this.selectedEventId = "";
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

  private searchEvents() {
    const address = this.selectedPlace != null ? this.selectedPlace.address :
      {} as Address;
    const dateFrom = this.form.controls['dateFrom'].value;
    const dateTo = this.form.controls['dateTo'].value;

    this.searchEventSub.unsubscribe();

    this.searchEventSub = this.eventService.findEvents(this.selectedActivity, address.neighborhood, address.locality, address.adminDistrict2,
      address.adminDistrict, dateFrom, dateTo, this.hours, 10, this.actualPage)
      .subscribe({
        next: value => {
          this.eventsResumesPage = value;
          this.isSearchFormCollapsed = true;
          this.actualPage = value.page;
        },
        error: err => {
          this.toastService.show("Hubo un error al intentar buscar eventos, por favor inténtelo más tarde",
            "bg-danger");
          console.error(err);
        }
      });
  }

  private updateEventDetailsContainerClasses() {
    if(this.isWindowWidthMD()) {
      this.eventDetailsContainerClasses = "col-md-6";
    } else {
      this.eventDetailsContainerClasses = "position-fixed start-0 bottom-0";
    }
  }

  isWindowWidthMD() {
    const windowWidth = window.innerWidth;
    return windowWidth >= 768;
  }

  onCloseEventDetailsView() {
    this.selectedEventId = "";
  }

  toggleCollapsedForm(collapsedForm: NgbCollapse) {
    collapsedForm.toggle();
    this.isSearchFormCollapsed = !this.isSearchFormCollapsed;
    if(!this.isSearchFormCollapsed) {
      this.resultsContainer.nativeElement.classList.remove('overflow-y-auto');
    }
  }

  onCollapsedFormHidden() {
    this.resultsContainer.nativeElement.classList.add('overflow-y-auto');
  }
}
