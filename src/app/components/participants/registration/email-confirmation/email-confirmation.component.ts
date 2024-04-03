import { Component } from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";

@Component({
  selector: 'rr-email-confirmation',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './email-confirmation.component.html',
  styleUrl: './email-confirmation.component.css'
})
export class EmailConfirmationComponent {
  verificationCode: number | undefined = undefined;

  onSubmit(form: NgForm) {
    if (form.invalid) {
      form.control.get('codeInput')?.markAsTouched();
      return;
    }
  }
}
