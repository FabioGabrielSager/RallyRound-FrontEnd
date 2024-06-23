import {Routes} from "@angular/router";
import {CreateEventComponent} from "../components/events/create-event/create-event.component";
import {MercadoPagoLinkedGuard} from "../guards/mercadopago/mercado-pago-linked.guard";
import {EventSearchComponent} from "../components/events/event-search/event-search.component";
import {MyEventsComponent} from "../components/events/my-events/my-events.component";
import {UserEventComponent} from "../components/events/user-event/user-event.component";
import {ModifyEventComponent} from "../components/events/modify-event/modify-event.component";
import {EventDetailsComponent} from "../components/events/event-details-component/event-details.component";

export const EventRoutes: Routes = [
  {path: 'create', component: CreateEventComponent, outlet: 'events', canActivate: [MercadoPagoLinkedGuard]},
  {path: 'search', component: EventSearchComponent, outlet: 'events'},
  {
    path: 'myevents',
    outlet: 'events',
    children: [
      {path: '', component: MyEventsComponent},
      {path: ':id', component: UserEventComponent},
      {path: 'modify/:id', component: ModifyEventComponent}
    ]
  },
  {path: ':id', component: EventDetailsComponent, outlet: 'events'}
]
