import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {catchError, debounceTime, filter, ObservableInput, of, Subscription, switchMap} from "rxjs";
import {NgClass} from "@angular/common";
import {RrActivityService} from "../../../services/rallyroundapi/rr-activity.service";
import {MatchedActivities} from "../../../models/common/MatchedActivities";
import {SearchResultsListComponent} from "../../shared/search-results-list/search-results-list.component";
import {MapApiService} from "../../../services/location/map-api.service";
import {AddressEntity} from "../../../models/location/AddressEntity";
import {ToastService} from "../../../services/toast.service";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {CreateEventRequest} from "../../../models/event/createEventRequest";

@Component({
  selector: 'rr-create-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    SearchResultsListComponent
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent implements OnInit {
  private subs: Subscription = new Subscription();

  private activityService: RrActivityService = inject(RrActivityService);
  private mapService: MapApiService = inject(MapApiService);
  private toastService: ToastService = inject(ToastService);
  private eventService: EventService = inject(EventService);

  private fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({});

  activity: string = 'Actividad';
  suggestedActivities: string[] = [];
  anActivityWasSelected: boolean = false;
  isActivityChanging: boolean = false;
  @ViewChild('activityInput') activityInput: ElementRef | undefined;

  descriptionLength: number = 0;

  anAddressWasSelected: boolean = false;
  isStreetNumberCheckboxChecked: boolean = false;
  formattedNames: string[] = [];
  formattedNameAddress: Map<string, AddressEntity> = new Map<string, AddressEntity>([]);
  selectedAddress: AddressEntity | undefined = undefined;

  hours: string[] = [];
  addingHour: boolean = false;
  addHourButtonWasTouched: boolean = false;

  participantsCount: number = 1;


  protected readonly Array = Array;

  ngOnInit(): void {
    // Init form
    this.form = this.fb.group({
      activity: ['Actividad', Validators.required],
      description: ['', [Validators.required, Validators.maxLength( 2000)]],
      address: ['', Validators.required],
      streetNumberCheckBox: [''],
      streetNumber: [''],
      date: ['', Validators.required],
      hours: this.fb.array([]),
      duration: ['', Validators.required],
      durationUnit: ['HOUR', Validators.required],
      participants: ['1', [Validators.required, Validators.min(1)]],
      inscriptionPrice: ['', [Validators.required, Validators.min(1)]]
    });

    this.subs.add(
      this.form.controls['activity'].valueChanges.subscribe(
        value => {
          this.activity = value;
        }
      )
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

    this.subs.add(
      this.form.controls['description'].valueChanges.subscribe(
        value => this.descriptionLength = value.length
      )
    );

    this.subs.add(
      this.form.controls['streetNumberCheckBox'].valueChanges.subscribe(
        value => {
          this.isStreetNumberCheckboxChecked = value;
          if(value) {
            this.form.controls['streetNumber'].addValidators([Validators.required]);
          } else {
            this.form.controls['streetNumber'].clearValidators();
          }
        }
      )
    );

    // Addresses autosuggestion
    this.subs.add(
      this.form.controls['address'].valueChanges.pipe(
        debounceTime(300),
        filter(query => query.length >= 3),
        switchMap( (query): ObservableInput<any> => {
          if(query == "" || this.anAddressWasSelected) {
            this.anAddressWasSelected = false;
            return of(null);
          }
          return this.mapService.getAutosuggestionAddresses(query).pipe(
            catchError(error => {
              console.error('Error fetching autosuggestions:', error);
              return of(error);
            })
          )
        })
      ).subscribe({
        next: (value: null | AddressEntity[]) => {
          this.formattedNames = [];
          this.formattedNameAddress.clear();
          if (value != null) {
            this.selectedAddress = undefined;
            value.forEach((a: AddressEntity) => {
              const address: AddressEntity = new AddressEntity(a.__type, a.address);
              let formattedName: string = address.getFormattedName();
              this.formattedNames.push(formattedName);
              this.formattedNameAddress.set(formattedName, a);
            });
          }
        },
        error: err => {
          this.toastService.show("Hubo un error al recuperar lugares, por favor inténtelo más tarde.",
            "bg-danger");
          console.log(err);
        }
      })
    );

    this.subs.add(
      this.form.controls['participants'].valueChanges.subscribe(
        value => this.participantsCount = value
      )
    );
  }

  onChangeActivity() {
    this.isActivityChanging = true;
    setTimeout(() => {
      this.activityInput?.nativeElement.select();
      this.activityInput?.nativeElement.focus();
    }, 100)
  }

  onBlurActivityInput() {
    setTimeout(() => {
      this.isActivityChanging = false;
    }, 100)
  }

  onClickActivitySearchResult($event: any) {
    this.suggestedActivities = [];
    this.activity = $event.target.innerText;
  }

  onBlurAddressInput() {
    setTimeout(() => {
      this.formattedNames = [];
      this.formattedNameAddress.clear();
    }, 200);
  }

  onClickAddressSearchResult($event: any) {
    this.selectedAddress = this.formattedNameAddress.get($event.target.innerText);
    this.form.controls['address'].setValue($event.target.innerText);
    this.anAddressWasSelected = true;
    this.formattedNames = [];
    this.formattedNameAddress.clear();
  }

  toggleAddHourInput() {
    this.addHourButtonWasTouched = true;
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

  onAddParticipant() {
    this.participantsCount++;
  }

  onRemoveParticipant() {
    if(this.participantsCount > 0) {
      this.participantsCount--;
    }
  }

  onSubmit() {
    if(this.form.invalid || this.hours.length < 1 || this.activity === 'Actividad' || !this.selectedAddress) {
      this.form.markAllAsTouched();
      this.addHourButtonWasTouched = true;
      return;
    }

    const { description,
      duration,
      durationUnit,
      inscriptionPrice,
      date } = this.form.controls;

    const createEventRequest: CreateEventRequest = {
      activity: this.activity,
      description: description.value,
      startHours: this.hours,
      duration: duration.value,
      durationUnit: durationUnit.value,
      inscriptionPrice: inscriptionPrice.value,
      date: date.value,
      address: this.selectedAddress
    };

    this.eventService.createEvent(createEventRequest).subscribe({
      next: value =>  {this.toastService.show("Evento Creado!", "bg-success")},
      error: err => {console.error(err)}
    });
  }
}
