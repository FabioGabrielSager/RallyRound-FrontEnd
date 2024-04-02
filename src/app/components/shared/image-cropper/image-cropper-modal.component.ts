import {Component, EventEmitter, inject, input, Input, output, Output, ViewChild} from '@angular/core';
import {ImageCroppedEvent, ImageCropperComponent, ImageCropperModule} from "ngx-image-cropper";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

export type CropperModalResult = {
  blob: Blob;
  imageUrl: string;
};
@Component({
  selector: 'rr-image-cropper',
  standalone: true,
  imports: [
    ImageCropperModule
  ],
  templateUrl: './image-cropper-modal.component.html',
  styleUrl: './image-cropper-modal.component.css'
})
export class ImageCropperModalComponent {
  @Input() imageFile: File | undefined;
  @Output() croppedResult: EventEmitter<CropperModalResult> = new EventEmitter<CropperModalResult>();
  @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent;

  activeModal = inject(NgbActiveModal);

  onImageCropped($event: ImageCroppedEvent) {
    const { blob, objectUrl} = $event;
    if (blob && objectUrl) {
      this.croppedResult.emit({blob, imageUrl: objectUrl});
      this.activeModal.dismiss();
    }
  }

  crop() {
    this.imageCropper.crop();
  }
}
