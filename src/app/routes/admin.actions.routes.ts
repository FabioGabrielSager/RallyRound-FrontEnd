import {Routes} from "@angular/router";
import {
  OverUsersActionsMenuComponent
} from "../components/admin/over-users-actions-menu/over-users-actions-menu.component";
import {RegisterAdminComponent} from "../components/admin/register-admin/register-admin.component";
import {RegisteredAdminsComponent} from "../components/admin/registered-admins/registered-admins.component";
import {AdminDetailsComponent} from "../components/admin/admin-details/admin-details.component";
import {ReportedParticipantsComponent} from "../components/admin/reported-participants/reported-participants.component";
import {AdminStatisticsMenuComponent} from "../components/admin/admin-statistics-menu/admin-statistics-menu.component";
import {AdminEventsMenuComponent} from "../components/admin/admin-events-menu/admin-events-menu.component";
import {ActivitiesComponent} from "../components/admin/activities/activities.component";

export const ADMIN_ACTIONS_ROUTES: Routes = [
  {
    path: 'users',
    outlet: 'admin',
    children: [
      {path: '', component: OverUsersActionsMenuComponent},
      {path: 'admin/register', component: RegisterAdminComponent},
      {path: 'admins', component: RegisteredAdminsComponent},
      {path: 'admin/:adminId', component: AdminDetailsComponent},
      {path: 'participants/reports', component: ReportedParticipantsComponent},
    ]
  },
  {
    path: 'statistics',
    outlet: 'admin',
    children: [
      {path: '', component: AdminStatisticsMenuComponent}
    ]
  },
  {
    path: 'events',
    outlet: 'admin',
    children: [
      {path: '', component: AdminEventsMenuComponent},
      {path: 'activities', component: ActivitiesComponent}
    ]
  }
]
