import {Routes} from '@angular/router';
import {PersonalInfoComponent} from "./components/participants/registration/personal-info/personal-info.component";
import {ProfilePhotoComponent} from "./components/participants/registration/profile-photo/profile-photo.component";
import {
  FavoriteActivitiesComponent
} from "./components/participants/registration/favorite-activities/favorite-activities.component";
import {
  EmailConfirmationComponent
} from "./components/participants/registration/email-confirmation/email-confirmation.component";
import {LoginComponent} from "./components/shared/login/login.component";
import {HomeComponent} from "./components/shared/home/home.component";
import {ParticipantHomeComponent} from "./components/participants/participant-home/participant-home.component";
import {AuthGuard} from "./guards/auth/auth.guard";
import {RegistrationComponent} from "./components/participants/registration/registration/registration.component";

export const routes: Routes = [
  {
    path: 'participant',
    children: [
      {
        path: 'account', children: []
      },
      {
        path: 'register',
        component: RegistrationComponent,
        children: [
          {path: 'personalInfo', component: PersonalInfoComponent, outlet: 'registration'},
          {path: 'photo', component: ProfilePhotoComponent, outlet: 'registration'},
          {path: 'activities', component: FavoriteActivitiesComponent, outlet: 'registration'},
          {path: 'confirmEmail', component: EmailConfirmationComponent, outlet: 'registration'}
        ]
      },
      {path: 'home/:name', component: ParticipantHomeComponent, canActivate: [AuthGuard]}
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
