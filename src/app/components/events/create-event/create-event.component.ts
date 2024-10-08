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
import {Router} from "@angular/router";
import {isEventStarTimeValid} from "../../../validators/isEventStarTimeValid";

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

  private router: Router = inject(Router);
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

  isEventCreatorParticipant: boolean = false;

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
      inscriptionPrice: ['', [Validators.required, Validators.min(0)]],
      participanOrganizer: ['organizer', Validators.required],
      selectedHour: []
    });

    this.subs.add(
      this.form.controls['activity'].valueChanges.subscribe(
        value => {
          this.activity = value;
        }
      )
    );

    this.subs.add(
      this.form.controls['participanOrganizer'].valueChanges.subscribe(
        value => {
          if(value != 'organizer') {
            this.isEventCreatorParticipant = true;
            this.form.controls['selectedHour'].addValidators([Validators.required]);
            this.form.controls['selectedHour'].updateValueAndValidity();

            if(this.hours.length == 1){
              this.form.controls['selectedHour'].setValue(0);
            }

          } else {
            this.isEventCreatorParticipant = false;
            this.form.controls['selectedHour'].clearValidators();
            this.form.controls['selectedHour'].updateValueAndValidity();
          }
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
            this.form.controls['streetNumber'].updateValueAndValidity();
          } else {
            this.form.controls['streetNumber'].clearValidators();
            this.form.controls['streetNumber'].updateValueAndValidity();
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
          console.error(err);
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
      if(isEventStarTimeValid(this.form.controls["date"].value, hourInput.value)) {
        this.hours.push(hourInput.value);
        hourInput.value = '';
        if(this.hours.length != 1){
          this.form.controls['selectedHour'].setValue(undefined);
        }
      } else {
        this.toastService.show("Los horarios de inicio deben ser establecidos con 4 horas de antelación mínimamente.", "bg-danger");
      }
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

    for (let i=0; i < this.hours.length; i++ ) {
      if(!isEventStarTimeValid(this.form.controls["date"].value, this.hours[i])) {
        this.toastService.show(`El horario de inicio ${this.hours[i]} ya no es valido`, "bg-danger");
        return;
      }
    }

    const { description,
      duration,
      durationUnit,
      inscriptionPrice,
      date } = this.form.controls;

    const createEventRequest: CreateEventRequest = {
      activity: this.activity,
      description: description.value,
      startingHours: this.hours,
      duration: duration.value,
      durationUnit: durationUnit.value,
      inscriptionPrice: inscriptionPrice.value,
      date: date.value,
      address: this.selectedAddress,
      participantsLimit: this.participantsCount,
      eventCreatorIsParticipant: this.isEventCreatorParticipant,
      eventCreatorSelectedStartHour: this.isEventCreatorParticipant ?
        this.hours[this.form.controls['selectedHour'].value]
        : undefined
    };

    this.eventService.createEvent(createEventRequest).subscribe({
      next: value =>  {
        this.router.navigate(['events', { outlets: { events: ['myevents', value.id]}}]);
      },
      error: err => {
        if(err.status === 400 && String(err.error.message).includes("The selected activity is not enabled.")) {
          this.toastService.show("La actividad seleccionada no esta disponible para crear eventos.", "bg-danger")
        } else {
          this.toastService.show("Hubo un error al intentar crear el evento.", "bg-danger")
          console.error(err);
        }
      }
    });
  }
}
