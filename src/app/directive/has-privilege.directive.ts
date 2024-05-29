import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from "../services/auth/auth.service";

@Directive({
  selector: '[hasPrivilege]',
  standalone: true
})
export class HasPrivilegeDirective {
  private requiredPrivilege!: string;

  constructor(
    private authService: AuthService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {
  }

  @Input()
  set hasPrivilege(privilege: string) {
    this.requiredPrivilege = privilege;
    this.updateView();
  }

  private updateView() {
    const currentUserPrivileges = this.authService.currentUserLoginOnPrivileges.value;
    if (currentUserPrivileges.includes(this.requiredPrivilege)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
