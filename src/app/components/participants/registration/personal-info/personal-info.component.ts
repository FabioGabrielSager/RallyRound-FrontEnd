import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MapApiService} from "../../../../services/map-api.service";
import {catchError, debounceTime, filter, ObservableInput, of, Subscription, switchMap} from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Place} from "../../../../models/location/place";
import {BingMapsApiLocationResponse} from "../../../../models/location/BingMapsApiLocationResponse";
import {DatePipe, formatDate, NgClass} from "@angular/common";
import {passwordMatchValidator} from "../../../../validators/passwordMatchValidator";
import {ParticipantRegistrarionRequest} from "../../../../models/user/participantRegistrarionRequest";
import {AuthService} from "../../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {ToastService} from "../../../../services/toast.service";
import {SearchResultsListComponent} from "../../../shared/search-results-list/search-results-list.component";
import {minAgeValidator} from "../../../../validators/minAgeValidator";

@Component({
  selector: 'rr-personal-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    SearchResultsListComponent,
    DatePipe
  ],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css'
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  private subs: Subscription = new Subscription();
  private toastService: ToastService = inject(ToastService);

  // Location
  private mapApiService: MapApiService = inject(MapApiService);
  private aLocationWasSelected: boolean = false;
  selectedPlace: Place | undefined = undefined;
  formattedNames: string[] = [];
  private formattedNamePlaces: Map<string, Place> = new Map<string, Place>([]);

  // Password
  passwordIsHide: boolean = true;
  confirmPasswordIsHide: boolean = true;

  // FORM
  birthdateControlInitialValue: Date = new Date();
  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({})

  private authService: AuthService = inject(AuthService);

  // Routing
  private router: Router = inject(Router);

  ngOnInit(): void {
    // Form initialization
    const today = new Date();
    this.birthdateControlInitialValue = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    this.form = this.fb.group({
      name: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      locality: ["", [Validators.required]],
      birthdate: [formatDate(this.birthdateControlInitialValue, 'yyyy-MM-dd', 'en'),
        [Validators.required, minAgeValidator(18)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(5)]],
      confirmPassword: ["", [Validators.required]]
    }, {validators: passwordMatchValidator});

    // Locations autosuggestion
    this.subs.add(
      this.form.controls['locality'].valueChanges.pipe(
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
        next: (value: null | BingMapsApiLocationResponse) => {
          this.formattedNames = [];
          this.formattedNamePlaces.clear();
          if (value != null && value.resourceSets != null && value.resourceSets[0].resources != null &&
            value.resourceSets[0].resources[0] != null) {
            this.selectedPlace = undefined;
            value.resourceSets[0].resources[0].value.forEach((p: Place) => {
              let formattedName: string = this.getFormattedName(p);
              this.formattedNames.push(formattedName);
              this.formattedNamePlaces.set(formattedName, p);
            });
          }
        },
        error: err => {
          this.toastService.show("Hubo un error al recuperar lugares, por favor intentelo más tarde.",
            "bg-danger");
          console.log(err);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private getFormattedName(p: Place): string {
    let formattedName: string = "";

    if (p.address.adminDistrict) {
      formattedName += `${p.address.adminDistrict}, `;
    }

    if (p.address.adminDistrict2) {
      formattedName += `${p.address.adminDistrict2}, `;
    }

    if (p.address.locality) {
      formattedName += `${p.address.locality}, `;
    }

    if (p.address.neighborhood) {
      formattedName += `${p.address.neighborhood}, `;
    }

    if (p.name) {
      formattedName += p.name;
    }
    if (formattedName.endsWith(", ")) {
      formattedName = formattedName.substring(0, formattedName.lastIndexOf(", "));
    }

    return formattedName;
  }

  onClickSearchResult($event: any) {
    this.selectedPlace = this.formattedNamePlaces.get($event.target.innerText);
    this.form.controls['locality'].setValue($event.target.innerText);
    this.aLocationWasSelected = true;
    this.formattedNames = [];
    this.formattedNamePlaces.clear();
  }

  onSubmit() {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if(!this.selectedPlace) {
      return;
    }

    let request: ParticipantRegistrarionRequest = new ParticipantRegistrarionRequest();

    request.name = this.form.controls['name'].value;
    request.lastName = this.form.controls['lastName'].value;
    request.place = this.selectedPlace;
    request.birthdate = this.form.controls['birthdate'].value;
    request.email = this.form.controls['email'].value;
    request.password = this.form.controls['password'].value;

    this.authService.setParticipantRegistrationRequestData(request);

    this.router.navigate(["participant/account/photo"])
  }

  onBlur() {
    setTimeout(() => {
      this.formattedNames = [];
      this.formattedNamePlaces.clear();
    }, 200);
  }

  togglePasswordVisibility() {
    this.passwordIsHide = !this.passwordIsHide;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordIsHide = !this.confirmPasswordIsHide;
  }
}
