import {Component, inject, Input, OnDestroy} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {
    SearchParticipantResultListComponent
} from "../../search-participant/search-participant-result-list/search-participant-result-list.component";
import {ParticipantService} from "../../../../services/rallyroundapi/participant.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UserPublicProfileComponent} from "../user-public-profile/user-public-profile.component";
import {ParticipantResume} from "../../../../models/user/participant/participantResume";
import {Subscription} from "rxjs";
import {ToastService} from "../../../../services/toast.service";

@Component({
  selector: 'rr-invite-participant-modal',
  standalone: true,
  imports: [
    FormsModule,
    SearchParticipantResultListComponent,
    UserPublicProfileComponent
  ],
  templateUrl: './invite-participant-modal.component.html',
  styleUrl: './invite-participant-modal.component.css'
})
export class InviteParticipantModalComponent implements OnDestroy {
  private participantService: ParticipantService = inject(ParticipantService);
  private toastService: ToastService = inject(ToastService);
  private subs: Subscription = new Subscription();
  activeModal: NgbActiveModal = inject(NgbActiveModal);
  @Input() participant!: ParticipantResume;
  @Input() eventId: string = "";

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onInviteUser() {
    this.subs.add(
      this.participantService.inviteParticipantToEvent(this.eventId, this.participant.id).subscribe({
        next: value => { this.activeModal.close() },
        error: err => {
          if(err.status == 400
            && String(err.error.message).includes("Event invitations can only be sent once per participant.")) {
            this.toastService.show("Ya has enviado una notificación a este participante.", "bg-danger");
          } else {
            this.toastService.show("Hubo un error al intentar enviar la invitación.", "bg-danger");
            console.error(err);
          }
        }
      })
    );
  }
}
