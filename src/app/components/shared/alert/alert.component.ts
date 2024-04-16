import {Component, inject, Input, TemplateRef} from '@angular/core';
import {ImageCropperModule} from "ngx-image-cropper";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgTemplateOutlet} from "@angular/common";


export class BodyString {
  fontSize: string = '1rem';
  fontColor: string = '';
  fontWeight: string = '';
  text: string = '';
}

@Component({
  selector: 'rr-alert',
  standalone: true,
  imports: [
    ImageCropperModule,
    NgTemplateOutlet
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {
  activeModal: NgbActiveModal = inject(NgbActiveModal);
  @Input() title: string = "";
  @Input() bodyTemplate: null | TemplateRef<any> = null;
  @Input() bodyString: BodyString | null = null;
  @Input() isAConfirm: boolean = false;
  @Input() confirmBehavior: Function | null = null;

  handleConfirmClick(): void {
    if (this.confirmBehavior) {
      this.confirmBehavior();
    }
    this.activeModal.dismiss();
  }

  isTemplate(): boolean {
    return this.bodyTemplate != null;
  }
}
