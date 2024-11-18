import {Routes} from "@angular/router";
import {
  ParticipantAccountDetailsComponent
} from "../components/participants/participant-account-details/participant-account-details.component";
import {AuthGuard} from "../guards/auth/auth.guard";
import {RegistrationComponent} from "../components/participants/registration/registration/registration.component";
import {PersonalInfoComponent} from "../components/participants/registration/personal-info/personal-info.component";
import {ProfilePhotoComponent} from "../components/participants/registration/profile-photo/profile-photo.component";
import {
  FavoriteActivitiesComponent
} from "../components/participants/registration/favorite-activities/favorite-activities.component";
import {
  TermsAndConditionsComponent
} from "../components/participants/registration/terms-and-conditions/terms-and-conditions.component";
import {
  EmailConfirmationComponent
} from "../components/participants/registration/email-confirmation/email-confirmation.component";
import {ParticipantHomeComponent} from "../components/participants/participant-home/participant-home.component";
import {clearAuthCacheGuard} from "../guards/auth/clear-auth-cache.guard";

export const PARTICIPANT_ROUTES: Routes = [
  {
    path: 'account', component: ParticipantAccountDetailsComponent, canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegistrationComponent,
    children: [
      {path: 'personalInfo', component: PersonalInfoComponent, outlet: 'registration'},
      {path: 'photo', component: ProfilePhotoComponent, outlet: 'registration'},
      {path: 'activities', component: FavoriteActivitiesComponent, outlet: 'registration'},
      {path: 'terms-and-conditions', component: TermsAndConditionsComponent, outlet: 'registration'},
      {path: 'confirmEmail', component: EmailConfirmationComponent, outlet: 'registration'}
    ],
    canDeactivate: [clearAuthCacheGuard]
  },
  {path: 'home/:name', component: ParticipantHomeComponent, canActivate: [AuthGuard]},
  {path: 'home', redirectTo: 'home/', pathMatch: 'full'}
]
