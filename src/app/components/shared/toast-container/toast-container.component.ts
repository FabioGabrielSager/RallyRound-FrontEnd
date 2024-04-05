import {Component, inject} from '@angular/core';
import {NgbToast} from "@ng-bootstrap/ng-bootstrap";
import {NgIf, NgTemplateOutlet} from "@angular/common";
import {Toast, ToastService} from "../../../services/toast.service";

@Component({
  selector: 'rr-toast-container',
  standalone: true,
  imports: [
    NgbToast,
    NgIf,
    NgTemplateOutlet
  ],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css',
  host: { class: 'toast-container position-fixed top-0 end-0 p-3 text-light', style: 'z-index: 1200' }
})
export class ToastContainerComponent {
  toastService: ToastService = inject(ToastService);

  isTemplate(toast: Toast) {
    return toast.template != null;
  }
}
