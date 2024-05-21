import {Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ParticipantPersonalDataDto} from "../../../models/user/participant/participantPersonalDataDto";
import {UserFavoriteActivity} from "../../../models/user/participant/userFavoriteActivity";
import {Place} from "../../../models/location/place";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {formatDate, Location, NgClass} from "@angular/common";
import {SearchResultsListComponent} from "../../shared/search-results-list/search-results-list.component";
import {MapApiService} from "../../../services/location/map-api.service";
import {catchError, debounceTime, filter, ObservableInput, of, Subject, Subscription, switchMap} from "rxjs";
import {ToastService} from "../../../services/toast.service";
import {minAgeValidator} from "../../../validators/minAgeValidator";
import {ParticipantService} from "../../../services/rallyroundapi/participant.service";
import {NavbarComponent, NavBarItem} from "../../shared/navbar/navbar.component";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {AlertComponent} from "../../shared/alert/alert.component";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth/auth.service";
import {ParticipantReputationMessages} from "../../../models/user/participant/reputation/participantReputationMessages";
import {ParticipantModificationRequest} from "../../../models/user/participant/participantModificationRequest";
import {CropperModalResult, ImageCropperModalComponent} from "../../shared/image-cropper/image-cropper-modal.component";
import {DomSanitizer} from "@angular/platform-browser";
import {FavoriteActivitiesModalComponent} from "../favorite-activities-modal/favorite-activities-modal.component";
import {arraysEqual} from "../../../utils/arrays-utils";
import {HourPipe} from "../../../pipe/hour.pipe";

@Component({
  selector: 'rr-participant-account-details',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SearchResultsListComponent,
    NgClass,
    NavbarComponent
  ],
  templateUrl: './participant-account-details.component.html',
  styleUrl: './participant-account-details.component.css'
})
export class ParticipantAccountDetailsComponent implements OnInit, OnDestroy {
  userData!: ParticipantPersonalDataDto;

  userModifiedData: ParticipantModificationRequest | null = null;
  userDataModifiedFieldCount: number = 0;
  hasProfilePhotoChanged: boolean = false;
  private onUserDataModification$: Subject<number> = new Subject<number>();

  navbarItems: NavBarItem[] = [];

  participantReputationMessages = ParticipantReputationMessages;

  private subs: Subscription = new Subscription();
  private toastService: ToastService = inject(ToastService);
  private participantService: ParticipantService = inject(ParticipantService);
  private location: Location = inject(Location);
  private router: Router = inject(Router);
  private modalService: NgbModal = inject(NgbModal);
  private authService: AuthService = inject(AuthService);
  private sanitizer: DomSanitizer = inject(DomSanitizer);

  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({});
  wasFormInitialized: boolean = false;

  // Location
  private mapApiService: MapApiService = inject(MapApiService);
  private aLocationWasSelected: boolean = false;
  selectedPlace: Place | undefined = undefined;
  formattedNames: string[] = [];
  private formattedNamePlaces: Map<string, Place> = new Map<string, Place>([]);
  uploadedPhotoPreview: any;
  private uploadedPhoto: File | null = null;

  deleteConfirmationForm: FormGroup = this.fb.group({});
  passwordIsHide: boolean = true;
  @ViewChild('deleteAccountConfirmation') deleteAccountConfirmation!: TemplateRef<any>;

  ngOnInit(): void {
    this.navbarItems = [
      {
        title: "",
        routerLink: "",
        href: "",
        bootstrapIconClasses: "bi bi-arrow-return-left",
        iconInLeftOfTitle: true,
        onClick: () => {
          this.location.back();
        }
      },
      {
        title: "Salir",
        routerLink: "",
        href: "",
        bootstrapIconClasses: "bi bi-box-arrow-right",
        iconInLeftOfTitle: false,
        onClick: () => {
          const modal: NgbModalRef = this.modalService.open(AlertComponent, {centered: true, size: "sm"});
          modal.componentInstance.isAConfirm = true;
          modal.componentInstance.title = "Salir";
          modal.componentInstance.bodyString = {textParagraphs: ["Seguro que quieres salir de RallyRound?"]};
          modal.componentInstance.confirmBehavior = () => {
            this.authService.logout();
            this.router.navigate(["/home"])
          }
        },
      }
    ];

    // Password confirmation form initialization:
    this.deleteConfirmationForm = this.fb.group({
      password: ["", [Validators.required, Validators.minLength(5)]],
      confirmation: ["", [Validators.required, Validators.pattern("CONFIRMAR")]]
    })

    // Form initialization
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      locality: ["", [Validators.required]],
      birthdate: ["", [Validators.required, minAgeValidator(18)]],
    });

    this.participantService.getUserPersonalData().subscribe({
      next: (value: ParticipantPersonalDataDto) => {
        this.userData = value;
        this.userData.place = new Place(value.place.__type, value.place.address, value.place.name);
        this.form.controls["name"]
          .setValue(this.userData.name);
        this.form.controls["lastName"]
          .setValue(this.userData.lastName);
        this.form.controls["locality"]
          .setValue(this.userData.place.getFormattedName());
        this.form.controls["birthdate"]
          .setValue(formatDate(this.userData.birthdate, 'yyyy-MM-dd', 'en'));
        this.wasFormInitialized = true;
      },
      error: err => {
        console.log(err);
      }
    });

    // Locations autosuggestion
    this.subs.add(
      this.form.controls['locality'].valueChanges.pipe(
        debounceTime(300),
        filter(query => query.length >= 3),
        switchMap((query): ObservableInput<any> => {
          if (query == "" || query == this.userData.place.getFormattedName() || this.aLocationWasSelected) {
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
              this.formattedNamePlaces.set(formattedName, place);
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

    Object.keys(this.form.controls).forEach((controlName: string) => {
      if (controlName != "locality") {
        this.form.get(controlName)!.valueChanges.subscribe((value: string) => {
          if (this.wasFormInitialized) {
            if (this.userData[controlName as keyof ParticipantPersonalDataDto] !== value) {
              if (this.userModifiedData == null) {
                this.userModifiedData = {} as ParticipantPersonalDataDto;
              }
              switch (controlName) {
                case "name": {
                  if (this.userModifiedData.name == undefined || this.userModifiedData.name == "") {
                    this.userDataModifiedFieldCount++;
                    this.onUserDataModification$.next(this.userDataModifiedFieldCount);
                  }
                  if (value) {
                    this.userModifiedData.name = value;
                  }
                  break;
                }
                case "lastName": {
                  if (this.userModifiedData.lastName == undefined || this.userModifiedData.lastName == "") {
                    this.userDataModifiedFieldCount++;
                    this.onUserDataModification$.next(this.userDataModifiedFieldCount);
                  }
                  if (value) {
                    this.userModifiedData.lastName = value;
                  }
                  break;
                }
                case "birthdate": {
                  if (this.userModifiedData.birthdate == undefined || this.userModifiedData.birthdate == "") {
                    this.userDataModifiedFieldCount++;
                    this.onUserDataModification$.next(this.userDataModifiedFieldCount);
                  }
                  if (value) {
                    this.userModifiedData.birthdate = value;
                  }
                  break;
                }
              }
            } else {
              if (this.userModifiedData != null) {
                if (this.userModifiedData[controlName as keyof ParticipantPersonalDataDto]) {
                  switch (controlName) {
                    case "name": {
                      this.userModifiedData.name = "";
                      break;
                    }
                    case "lastName": {
                      this.userModifiedData.lastName = "";
                      break;
                    }
                    case "birthdate": {
                      this.userModifiedData.birthdate = "";
                      break;
                    }
                  }
                  this.userDataModifiedFieldCount--;
                  this.onUserDataModification$.next(this.userDataModifiedFieldCount);
                }
              }
            }
          }
        });
      }
    });

    this.subs.add(this.onUserDataModification$.subscribe(
      value => {
        if (value === 0) {
          this.userModifiedData = null;
        }
        console.log(this.userModifiedData);
      }
    ));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onBlur() {
    setTimeout(() => {
      this.formattedNames = [];
      this.formattedNamePlaces.clear();
    }, 200);
  }

  onClickSearchResult($event: any) {
    this.selectedPlace = this.formattedNamePlaces.get($event.target.innerText);
    if (this.selectedPlace) {
      this.selectedPlace = new Place(this.selectedPlace.__type, this.selectedPlace.address, this.selectedPlace.name)
    }

    this.form.controls['locality'].setValue($event.target.innerText);
    this.aLocationWasSelected = true;
    this.formattedNames = [];
    this.formattedNamePlaces.clear();

    if (this.userData.place.getFormattedName() !== this.selectedPlace?.getFormattedName()) {
      if (this.userModifiedData == null) {
        this.userModifiedData = {} as ParticipantPersonalDataDto;
        if (this.selectedPlace) {
          this.userModifiedData.place = this.selectedPlace;
          this.userDataModifiedFieldCount++;
          this.onUserDataModification$.next(this.userDataModifiedFieldCount);
        }
      }
    } else {
      if (this.userModifiedData != null) {
        if (this.userModifiedData.place) {
          this.userModifiedData.place = null;
          this.userDataModifiedFieldCount--;
          this.onUserDataModification$.next(this.userDataModifiedFieldCount);
        }
      }
    }
  }

  onEditableContentMouseOver(elementToShow: HTMLDivElement) {
    elementToShow.classList.remove('invisible');
    elementToShow.classList.add('visible');
  }

  onEditableContentMouseOut(elementToHide: HTMLDivElement) {
    elementToHide.classList.add('invisible');
    elementToHide.classList.remove('visible');
  }

  capturePhoto(event: any) {
    let modalRef: NgbModalRef = this.modalService.open(ImageCropperModalComponent,
      {centered: true, size: "xl"});
    modalRef.componentInstance.imageFile = event.target.files[0];
    this.subs.add(
      modalRef.componentInstance.croppedResult.subscribe(
        (value: CropperModalResult) => {
          this.uploadedPhotoPreview = this.sanitizer.bypassSecurityTrustUrl(value.imageUrl);
          this.hasProfilePhotoChanged = true;
          this.imageUrlToFile(value.imageUrl, "profilePhoto").then(
            file => this.uploadedPhoto = file
          ).catch(
            error => {
              this.toastService.show("Hubo un error al intentar cargar la foto.", "bg-danger");
              console.error(error)
            }
          );
        }
      )
    );
  }

  imageUrlToFile = async function (imageUrl: string, fileName: string): Promise<File> {
    // Fetch image data from URL
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    // Create File object
    return new File([blob], fileName, {type: blob.type});
  }

  onClickActivitiesContainer() {
    const modal = this.modalService.open(FavoriteActivitiesModalComponent,
      {centered: true, size: 'lg'});

    this.subs.add(
      modal.componentInstance.onConfirmSelection.subscribe(
        (selection: UserFavoriteActivity[]) => {
          if (!arraysEqual(this.userData.favoriteActivities, selection)) {
            if (this.userModifiedData === null) {
              this.userModifiedData = {} as ParticipantModificationRequest;
            }
            this.userModifiedData.favoriteActivities = selection;
            this.userDataModifiedFieldCount++;
            this.onUserDataModification$.next(this.userDataModifiedFieldCount);
          } else {
            if (this.userModifiedData != null) {
              if (this.userModifiedData.favoriteActivities) {
                this.userModifiedData.favoriteActivities = [];
                this.userDataModifiedFieldCount--;
                this.onUserDataModification$.next(this.userDataModifiedFieldCount);
              }
            }
          }
        }
      )
    );
  }

  onSaveChanges() {
    if (this.userModifiedData != null || this.hasProfilePhotoChanged)
      this.participantService.modifyUserAccount(this.userModifiedData, this.uploadedPhoto)
        .subscribe({
          next: value => {
            this.userData = value;
            this.userData.place = new Place(value.place.__type, value.place.address, value.place.name);
            this.userDataModifiedFieldCount = 0;
            this.userModifiedData = null;
            this.toastService.show("Cambios guardados con éxito.", "bg-success")
          },
          error: err => console.error(err)
        });
  }

  togglePasswordVisibility() {
    this.passwordIsHide = !this.passwordIsHide;
  }

  onClickDeleteAccount() {
    const modal = this.modalService.open(AlertComponent, {centered: true});
    modal.componentInstance.isAConfirm = true;
    modal.componentInstance.bodyTemplate = this.deleteAccountConfirmation;
    modal.componentInstance.title = "Eliminar cuenta.";
    modal.componentInstance.closeModalAfterConfirm = false;
    modal.componentInstance.confirmBehavior = () => {
      if (this.deleteConfirmationForm.invalid) {
        this.deleteConfirmationForm.markAllAsTouched();
        return;
      }

      this.subs.add(
        this.participantService.deleteUserAccount(this.deleteConfirmationForm.controls["password"].value)
          .subscribe({
            next: () => {
              this.toastService.show("Cuenta eliminada con éxito.", "bg-success");
              location.reload();
            },
            error: err => {
              if (err.status == 401) {
                this.toastService.show("Error: Contraseña no valida.", "bg-danger");
              } else {
                this.toastService.show("Hubo un error al intentar eliminar la cuenta.",
                  "bg-danger");
              }
            }
          })
      );

      this.deleteConfirmationForm.reset();
      modal.close();
    }

    this.subs.add(modal.closed.subscribe( () => this.deleteConfirmationForm.reset() ))
  }
}
