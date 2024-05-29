import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {HasPrivilegeDirective} from "../../../directive/has-privilege.directive";

@Component({
  selector: 'rr-over-users-actions-menu',
  standalone: true,
  imports: [
    RouterLink,
    HasPrivilegeDirective
  ],
  templateUrl: './over-users-actions-menu.component.html',
  styleUrl: './over-users-actions-menu.component.css'
})
export class OverUsersActionsMenuComponent {

}
