import {Routes} from '@angular/router';
import {LoginComponent} from "./components/shared/login/login.component";
import {HomeComponent} from "./components/shared/home/home.component";
import {AuthGuard} from "./guards/auth/auth.guard";
import {EventOutletComponent} from "./components/events/event-outlet/event-outlet.component";
import {AdminOutletComponent} from "./components/admin/admin-outlet/admin-outlet.component";

export const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'actions',
        loadComponent: () => import('./components/admin/admin-outlet/admin-outlet.component')
          .then(c => c.AdminOutletComponent),
        loadChildren: () => import('./routes/admin.actions.routes')
          .then(r => r.ADMIN_ACTIONS_ROUTES)
      },
      {
        path: 'home/:name',
        loadComponent: () => import('./components/admin/admin-home/admin-home.component')
          .then(c => c.AdminHomeComponent)
      },
    ]
  },
  {
    path: 'participant',
    loadChildren: () => import('./routes/participant.routes')
      .then(r => r.PARTICIPANT_ROUTES)
  },
  {
    path: 'events',
    component: EventOutletComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import('./routes/event.routes')
      .then(r => r.EventRoutes)
  },
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: 'home', pathMatch: 'full'}
];
