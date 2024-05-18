import {Component, inject, Input, input, OnInit} from '@angular/core';
import {UserPublicDataDto} from "../../../models/user/participant/userPublicDataDto";
import {UserFavoriteActivity} from "../../../models/user/participant/userFavoriteActivity";
import {ActivatedRoute} from "@angular/router";
import {Subscription, tap} from "rxjs";
import {ParticipantService} from "../../../services/rallyroundapi/participant.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'rr-user-public-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-public-profile.component.html',
  styleUrl: './user-public-profile.component.css'
})
export class UserPublicProfileComponent implements OnInit {
  userData: UserPublicDataDto = {
    reputationAsEventCreator: "BUENA",
    reputationAsParticipant: "BUENA",
    name: "Fabio",
    favoriteActivities: [
      { name: "Futbol", order: 0 } as UserFavoriteActivity,
      { name: "Básquet", order: 1 } as UserFavoriteActivity
    ]
  } as UserPublicDataDto;

  private toastService: ToastService = inject(ToastService);
  private participantService: ParticipantService = inject(ParticipantService)
  private route: ActivatedRoute = inject(ActivatedRoute);
  private subs: Subscription = new Subscription();
  @Input() userId: string = "";

  ngOnInit(): void {
    if(this.userId == "") {
      this.route.params.pipe(
        tap(value => this.userId = value['userId'])
      );
    }

    this.subs.add(
      this.participantService.getUserData(this.userId).subscribe(
        {
          next: value => {
            this.userData = value;
            this.userData.favoriteActivities.sort((a, b) => a.order - b.order)
          },
          error: err => {
            this.toastService.show("Hubo un error al intentar recuperar los datos del usuario.",
              "bg-danger");
          }
        }
      )
    );
  }
}
