import {Component, inject, OnDestroy} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {NgClass} from "@angular/common";
import {AuthService} from "../../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {
  CropperModalResult,
  ImageCropperModalComponent
} from "../../../shared/image-cropper/image-cropper-modal.component";
import {Subscription} from "rxjs";
import {ToastService} from "../../../../services/toast.service";

@Component({
  selector: 'rr-profile-photo',
  standalone: true,
  imports: [
    FormsModule,
    NgClass
  ],
  templateUrl: './profile-photo.component.html',
  styleUrl: './profile-photo.component.css'
})
export class ProfilePhotoComponent implements OnDestroy {
  uploadedPhotoPreview: any;
  private uploadedPhoto: File | null = null;
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private modalService: NgbModal = inject(NgbModal);
  private subs: Subscription = new Subscription();
  private sanitizer: DomSanitizer = inject(DomSanitizer);
  private toastService: ToastService = inject(ToastService);

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  capturePhoto(event: any) {
     let modalRef: NgbModalRef = this.modalService.open(ImageCropperModalComponent,
       {centered: true, size: "xl"});
     modalRef.componentInstance.imageFile = event.target.files[0];
     this.subs.add(
       modalRef.componentInstance.croppedResult.subscribe(
         (value: CropperModalResult) => {
           let sanitizedImageUrl = this.sanitizer.bypassSecurityTrustUrl(value.imageUrl);
           this.uploadedPhotoPreview = sanitizedImageUrl;
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

  onClickNext() {
    if (this.uploadedPhoto) {
      this.authService.setParticipantRegistrationRequestPhoto(this.uploadedPhoto);
    }

    this.router.navigate(["participant/account/activities"]);
  }
}
