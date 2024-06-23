import { Component } from '@angular/core';
import {HasPrivilegeDirective} from "../../../directive/has-privilege.directive";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'rr-admin-events-menu',
  standalone: true,
  imports: [
    HasPrivilegeDirective,
    RouterLink
  ],
  templateUrl: './admin-events-menu.component.html',
  styleUrl: './admin-events-menu.component.css'
})
export class AdminEventsMenuComponent {

}
