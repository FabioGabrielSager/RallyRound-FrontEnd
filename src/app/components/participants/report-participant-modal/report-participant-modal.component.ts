import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {ReportMotive} from "../../../models/user/participant/report/reportMotive";
import {KeyValuePipe} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ReportMotiveMessages} from "../../../models/user/participant/report/reportMotiveMessages";
import {Subscription} from "rxjs";
import {ReportRequest} from "../../../models/user/participant/report/reportRequest";
import {ParticipantService} from "../../../services/rallyroundapi/participant.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'rr-report-participant-modal',
  standalone: true,
  imports: [
    KeyValuePipe,
    ReactiveFormsModule
  ],
  templateUrl: './report-participant-modal.component.html',
  styleUrl: './report-participant-modal.component.css'
})
export class ReportParticipantModalComponent implements OnInit, OnDestroy {
  activeModal: NgbActiveModal = inject(NgbActiveModal);
  reportMotive = ReportMotive;
  reportForm!: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);
  private participantService: ParticipantService = inject(ParticipantService);
  private toastService: ToastService = inject(ToastService);

  @Input() reportedUserId: string = "";

  reportMotiveMessages = ReportMotiveMessages;
  reportMotiveOrder: ReportMotive[] = [
    ReportMotive.INAPPROPRIATE_BEHAVIOR,
    ReportMotive.SPAMMING,
    ReportMotive.HARASSMENT,
    ReportMotive.OFFENSIVE_LANGUAGE,
    ReportMotive.FRAUD,
    ReportMotive.IMPERSONATION,
    ReportMotive.INAPPROPRIATE_CONTENT,
    ReportMotive.ABSENTEEISM,
    ReportMotive.OTHER
  ];

  descriptionLength: number = 0;

  private subs: Subscription = new Subscription();

  constructor() {
    this.reportForm = this.fb.group({
      reportMotive: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      asEventCreator: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.subs.add(
      this.reportForm.controls['description'].valueChanges.subscribe(
        value => this.descriptionLength = value.length
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmitReport() {
    if (this.reportForm.invalid) {
      this.reportForm.markAllAsTouched();
      return;
    }

    const reportRequest: ReportRequest = {
      reportedUserId: this.reportedUserId,
      reportMotive: this.reportForm.controls["reportMotive"].value,
      description: this.reportForm.controls["description"].value,
      asEventCreator: this.reportForm.controls["asEventCreator"].value
    } as ReportRequest;

    this.subs.add(
      this.participantService.sendUserReport(reportRequest).subscribe({
        next: () => {
          this.toastService.show("Reporte enviado con éxito.", "bg-success");
          this.activeModal.close("report submitted");
        },
        error: err => {
          const errorMessage = String(err.error.message);
          if(err.status == 400 && errorMessage.includes("You have already reported this user.")) {
            this.toastService.show("No puedes reportar dos veces a un usuario por un mismo rol.", "bg-danger");
          } else {
            this.toastService.show("Hubo un error al intentar enviar el reporte.", "bg-danger");
          }
        }
      })
    );
  }
}
