import { Routes } from '@angular/router';
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

export const routes: Routes = [
  {
    path: 'participant',
    children: [
      { path: 'account', children: [
          {path: 'registration', component: PersonalInfoComponent},
          {path: 'photo', component: ProfilePhotoComponent},
          {path: 'activities', component: FavoriteActivitiesComponent},
          {path: 'confirmEmail/:userId', component: EmailConfirmationComponent}
        ]
      }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
