import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {EventResponseForEventCreators} from "../../../models/event/eventResponseForEventCreators";
import {EventModificationRequest} from "../../../models/event/eventModificationRequest";
import {BehaviorSubject, catchError, debounceTime, filter, ObservableInput, of, Subscription, switchMap} from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SearchResultsListComponent} from "../../shared/search-results-list/search-results-list.component";
import {MatchedActivities} from "../../../models/common/MatchedActivities";
import {AddressEntity} from "../../../models/location/AddressEntity";
import {MapApiService} from "../../../services/location/map-api.service";
import {RrActivityService} from "../../../services/rallyroundapi/rr-activity.service";
import {ToastService} from "../../../services/toast.service";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {formatDate, Location, NgClass} from "@angular/common";
import {EventDurationUnit} from "../../../models/event/eventDurationUnit";

@Component({
  selector: 'rr-modify-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SearchResultsListComponent,
    NgClass,
  ],
  templateUrl: './modify-event.component.html',
  styleUrl: './modify-event.component.css'
})
export class ModifyEventComponent implements OnInit, OnDestroy {
  private subs: Subscription = new Subscription();
  private fb: FormBuilder = inject(FormBuilder);
  private mapService: MapApiService = inject(MapApiService);
  private activityService: RrActivityService = inject(RrActivityService);
  private toastService: ToastService = inject(ToastService);
  private eventService: EventService = inject(EventService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private location: Location = inject(Location);

  form: FormGroup = this.fb.group({});

  private eventId: string = "";
  eventData!: EventResponseForEventCreators;
  private eventModifiedData: EventModificationRequest = {} as EventModificationRequest;
  eventDataHasBeenLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  eventDataModifiedFieldCount: number = 0;
  eventStartingHoursWereModified: boolean = false;

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
    this.subs.add(this.route.params.subscribe((params: Params) => this.eventId = params["id"]));

    this.subs.add(
      this.eventService.getCurrentUserCreatedEvent(this.eventId).subscribe({
        next: event => {
          this.eventData = event;
          this.eventData.address = new AddressEntity(event.address.__type, event.address.address);
          this.eventDataHasBeenLoaded$.next(true);
        },
        error: err => {
          this.toastService.show("Hubo un error al intentar recuperar el evento.", "bg-danger");
          this.location.back();
          console.error(err);
        }
      })
    );

    this.subs.add(this.eventDataHasBeenLoaded$.subscribe(
      value => {
        if (value) {
          this.form = this.fb.group({
            activity: [this.eventData.activity, Validators.required],
            description: [this.eventData.description, [Validators.required, Validators.maxLength(2000)]],
            address: [this.eventData.address.getFormattedName(), Validators.required],
            streetNumberCheckBox: [this.eventData.address.address.streetName],
            streetNumber: [this.eventData.address.address.streetName],
            date: [formatDate(this.eventData.date, 'yyyy-MM-dd', 'en'), Validators.required],
            duration: [this.eventData.duration, Validators.required],
            durationUnit: [this.eventData.durationUnit, Validators.required],
            participantsLimit: [this.eventData.participantsLimit, [Validators.required, Validators.min(1)]],
            inscriptionPrice: [this.eventData.inscriptionPrice, [Validators.required, Validators.min(0)]],
            participanOrganizer: [this.eventData.eventCreatorIsParticipant ? 'participant' : 'organizer',
              Validators.required],
            selectedHour: [this.eventData.selectedStartingHour]
          });

          this.selectedAddress = this.eventData.address;
          this.activity = this.eventData.activity;
          this.descriptionLength = this.eventData.description.length;
          this.hours = JSON.parse(JSON.stringify(this.eventData.startingHours));
          this.isEventCreatorParticipant = this.eventData.eventCreatorIsParticipant;

          Object.keys(this.form.controls).forEach((controlName: string) => {
            if (controlName != "address" && controlName != "streetNumber" && controlName != "participanOrganizer") {
              this.subs.add(
                this.form.get(controlName)!.valueChanges.subscribe((controlValue: string) => {
                  if (controlValue != null || controlValue != undefined) {
                    if (this.eventData[controlName as keyof EventResponseForEventCreators] !== controlValue) {
                      switch (controlName) {
                        case "activity": {
                          if (this.eventModifiedData.activity == undefined || this.eventModifiedData.activity == "") {
                            this.eventDataModifiedFieldCount++;
                          }
                          if (controlValue) {
                            this.activity = controlValue;
                            this.eventModifiedData.activity = controlValue;
                          }
                          break;
                        }
                        case "description": {
                          if (this.eventModifiedData.description == undefined || this.eventModifiedData.description == "") {
                            this.eventDataModifiedFieldCount++;
                          }
                          if (controlValue) {
                            this.eventModifiedData.description = controlValue;
                          }
                          break;
                        }
                        case "duration": {
                          if (this.eventModifiedData.duration == undefined) {
                            this.eventDataModifiedFieldCount++;
                          }
                          if (controlValue) {
                            this.eventModifiedData.duration = Number(controlValue);
                          }
                          break;
                        }
                        case "durationUnit": {
                          if (this.eventModifiedData.durationUnit == undefined) {
                            this.eventDataModifiedFieldCount++;
                          }
                          if (controlValue) {
                            this.eventModifiedData.durationUnit = controlValue == EventDurationUnit.HOUR ?
                              EventDurationUnit.HOUR : EventDurationUnit.MINUTE;
                          }
                          break;
                        }
                        case "inscriptionPrice": {
                          if (this.eventModifiedData.inscriptionPrice == undefined) {
                            this.eventDataModifiedFieldCount++;
                          }
                          if (controlValue) {
                            this.eventModifiedData.inscriptionPrice = Number(controlValue);
                          }
                          break;
                        }
                        case "date": {
                          if (this.eventModifiedData.date == undefined || this.eventModifiedData.date == "") {
                            this.eventDataModifiedFieldCount++;
                          }
                          if (controlValue) {
                            this.eventModifiedData.date = controlValue;
                          }
                          break;
                        }
                        case "participantsLimit": {
                          if (this.eventModifiedData.participantsLimit == undefined) {
                            this.eventDataModifiedFieldCount++;
                          }
                          if (controlValue) {
                            this.eventModifiedData.participantsLimit = Number(controlValue);
                          }
                          break;
                        }
                        case "selectedHour": {
                          if (this.eventModifiedData.eventCreatorSelectedStartHour == undefined) {
                            this.eventDataModifiedFieldCount++;
                          }
                          if (controlValue) {
                            this.eventModifiedData.eventCreatorSelectedStartHour = controlValue;
                          }
                          break;
                        }
                      }
                    } else {
                      if (this.eventModifiedData[controlName as keyof EventModificationRequest]) {
                        switch (controlName) {
                          case "activity": {
                            this.activity = "";
                            break;
                          }
                          case "description": {
                            this.eventModifiedData.description = "";
                            break;
                          }
                          case "duration": {
                            this.eventModifiedData.duration = undefined;
                            break;
                          }
                          case "durationUnit": {
                            this.eventModifiedData.durationUnit = undefined;
                            break;
                          }
                          case "inscriptionPrice": {
                            this.eventModifiedData.inscriptionPrice = undefined;
                            break;
                          }
                          case "date": {
                            this.eventModifiedData.date = "";
                            break;
                          }
                          case "participantsLimit": {
                            this.eventModifiedData.participantsLimit = undefined;
                            break;
                          }
                          case "selectedHour": {
                            this.eventModifiedData.eventCreatorSelectedStartHour = "";
                          }
                        }
                        this.eventDataModifiedFieldCount--;
                      }
                    }
                  }

                })
              );
            }
          })

          this.subs.add(
            this.form.controls['participanOrganizer'].valueChanges.subscribe(
              value => {
                if (value != 'organizer') {
                  this.isEventCreatorParticipant = true;
                  this.form.controls['selectedHour'].addValidators([Validators.required]);
                  this.form.controls['selectedHour'].updateValueAndValidity();

                  if (this.hours.length == 1) {
                    this.form.controls['selectedHour'].setValue(0);
                  }

                } else {
                  this.isEventCreatorParticipant = false;
                  this.form.controls['selectedHour'].clearValidators();
                  this.form.controls['selectedHour'].updateValueAndValidity();
                }

                this.eventModifiedData.eventCreatorIsParticipant = this.isEventCreatorParticipant;
                if (this.eventModifiedData.eventCreatorIsParticipant != this.eventData.eventCreatorIsParticipant) {
                  this.eventDataModifiedFieldCount++;
                } else {
                  this.eventDataModifiedFieldCount--;
                }
              }
            )
          );

          // Activities autosuggestion
          this.subs.add(
            this.form.controls['activity'].valueChanges.pipe(
              debounceTime(300),
              filter(query => query.length >= 3),
              switchMap((query): ObservableInput<any> => {
                if (query == "" || this.anActivityWasSelected) {
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
                if (value) {
                  this.form.controls['streetNumber'].addValidators([Validators.required]);
                  this.form.controls['streetNumber'].updateValueAndValidity();
                } else {
                  this.form.controls['streetNumber'].clearValidators();
                  this.form.controls['streetNumber'].reset();
                  this.form.controls['streetNumber'].updateValueAndValidity();
                }
              }
            )
          );

          this.subs.add(
            this.form.controls['streetNumber'].valueChanges.subscribe(
              value => {
                if (value != null && this.eventData.address.address.houseNumber != String(value)) {
                  if (this.eventModifiedData.address == null) {
                    this.eventModifiedData.address = JSON.parse(JSON.stringify(this.eventData.address));
                  }

                  if (value && this.eventModifiedData.address?.address.houseNumber == "") {
                    this.eventDataModifiedFieldCount++;
                  }

                  if (value && this.eventModifiedData.address != null) {
                    this.eventModifiedData.address.address.houseNumber = value;
                  }
                } else {
                  if (this.eventModifiedData.address) {
                    this.eventModifiedData.address.address.houseNumber = "";
                    if (this.eventDataModifiedFieldCount > 0) {
                      this.eventDataModifiedFieldCount--;
                    }
                  }
                }
              }
            )
          );

          // Addresses autosuggestion
          this.subs.add(
            this.form.controls['address'].valueChanges.pipe(
              debounceTime(300),
              filter(query => query.length >= 3),
              switchMap((query): ObservableInput<any> => {
                if (query == "" || this.anAddressWasSelected) {
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
            this.form.controls['participantsLimit'].valueChanges.subscribe(
              value => this.participantsCount = value
            )
          );
        }
      }
    ))
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
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
    if (this.selectedAddress) {
      this.selectedAddress = new AddressEntity(this.selectedAddress.__type, this.selectedAddress.address);
    }

    this.form.controls['address'].setValue($event.target.innerText);
    this.anAddressWasSelected = true;
    this.formattedNames = [];
    this.formattedNameAddress.clear();

    if (this.eventData.address.getFormattedName() !== this.selectedAddress?.getFormattedName()) {
      this.form.controls['streetNumber'].reset();
      if (this.selectedAddress) {
        this.eventModifiedData.address = this.selectedAddress;
        this.eventDataModifiedFieldCount++;
      }
    } else {
      if (this.eventModifiedData.address) {
        this.eventModifiedData.address = null;
        this.eventDataModifiedFieldCount--;
      }
    }
  }

  toggleAddHourInput() {
    this.addHourButtonWasTouched = true;
    this.addingHour = !this.addingHour;
  }

  onAddNewHour(hourInput: HTMLInputElement) {
    if (!this.hours.some(hour => hour === hourInput.value) && hourInput.value !== '') {
      this.hours.push(hourInput.value);
      hourInput.value = '';
      if (this.hours.length != 1) {
        this.form.controls['selectedHour'].setValue(undefined);
      }

      this.wereEventStartingHoursModified();
    }
  }

  onRemoveHour(i: number) {
    this.hours.splice(i, 1);

    this.wereEventStartingHoursModified();
  }

  wereEventStartingHoursModified() {
    this.hours.sort()
    this.eventData.startingHours.sort();

    if (this.hours.length !== this.eventData.startingHours.length
      || JSON.stringify(this.hours) !== JSON.stringify(this.eventData.startingHours)) {
      this.eventModifiedData.startingHours = this.hours;
      this.eventStartingHoursWereModified = true;
    } else {
      this.eventModifiedData.startingHours = null;
      this.eventStartingHoursWereModified = false;
    }
  }

  onSubmit() {
    if (this.form.invalid || this.hours.length < 1 || this.activity === 'Actividad' || !this.selectedAddress) {
      this.form.markAllAsTouched();
      this.addHourButtonWasTouched = true;
      return;
    }

    if(this.eventStartingHoursWereModified || this.eventDataModifiedFieldCount > 0) {
      this.eventModifiedData.eventId = this.eventId;
      this.subs.add(
        this.eventService.modifyEvent(this.eventModifiedData).subscribe({
          next: (value) => {
            this.router.navigate(['events', { outlets: { events: ['myevents', value.id]}}]);
          },
          error: err => console.error(err)
        })
      );
    }
  }
}
