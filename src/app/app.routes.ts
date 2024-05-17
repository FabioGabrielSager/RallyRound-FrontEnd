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
import {CreateEventComponent} from "./components/events/create-event/create-event.component";
import {EventOutletComponent} from "./components/events/event-outlet/event-outlet.component";
import {MercadoPagoLinkedGuard} from "./guards/mercadopago/mercado-pago-linked.guard";
import {MyCreatedEventComponent} from "./components/events/my-created-event/my-created-event.component";
import {EventSearchComponent} from "./components/events/event-search/event-search.component";
import {MyEventsComponent} from "./components/events/my-events/my-events.component";
import {UserEventComponent} from "./components/events/user-event/user-event.component";

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
      {path: 'home/:name', component: ParticipantHomeComponent, canActivate: [AuthGuard]},
      {path: 'home', redirectTo: 'home/', pathMatch: 'full'}
    ]
  },
  {
    path: 'events',
    component: EventOutletComponent,
    canActivate: [AuthGuard],
    children: [
      {path: 'create', component: CreateEventComponent, outlet: 'events', canActivate: [MercadoPagoLinkedGuard]},
      {path: 'search', component: EventSearchComponent, outlet: 'events'},
      {
        path: 'myevents',
        outlet: 'events',
        children: [
          {path: '', component: MyEventsComponent},
          {path: ':id', component: UserEventComponent}
        ]
      },
    ]
  },
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];
