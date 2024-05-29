import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AdminResume} from "../../../models/user/admin/adminResumeDto";
import {DatePipe} from "@angular/common";
import {
  NgbCollapse,
  NgbDropdown,
  NgbDropdownButtonItem,
  NgbDropdownMenu,
  NgbDropdownToggle
} from "@ng-bootstrap/ng-bootstrap";
import {AdminService} from "../../../services/rallyroundapi/admin.service";
import {Subscription} from "rxjs";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DepartmentService} from "../../../services/rallyroundapi/department.service";
import {Router} from "@angular/router";

@Component({
  selector: 'rr-registered-admins',
  standalone: true,
  imports: [
    DatePipe,
    NgbCollapse,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownButtonItem,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './registered-admins.component.html',
  styleUrl: './registered-admins.component.css'
})
export class RegisteredAdminsComponent implements OnInit,OnDestroy {
  private adminService: AdminService = inject(AdminService);
  private departmentService: DepartmentService = inject(DepartmentService);
  private subs: Subscription = new Subscription();
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);

  currentLoginOnAdminAccount!: AdminResume;
  admins: AdminResume[] = [];

  departments: string[] = [];

  filtersForm: FormGroup = this.fb.group({});

  haveInitialValues: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      name: [""],
      lastName: [""],
      department: [""],
      regDateFrom: [""],
      regDateTo: [""],
      enabled: [true]
    });

    this.subs.add(
      this.departmentService.getDepartments().subscribe({
        next: (departments: string[]) => this.departments = departments,
        error: err => console.error(err)
      })
    );

    this.subs.add(
      this.adminService.getRegisteredAdmins(undefined,undefined,undefined,
        undefined,undefined,undefined).subscribe(
        {
          next: (value: AdminResume[]) => {
            value.forEach(ar => {
              if(ar.requesterAccount) {
                this.currentLoginOnAdminAccount = ar;
              }
            });

            this.admins = value;

            if(this.currentLoginOnAdminAccount) {
              this.admins.splice(this.admins.indexOf(this.currentLoginOnAdminAccount), 1);
            }

            this.haveInitialValues = true;
          },
          error: err => {
            console.error(err);
          }
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onSubmit() {
    const { name, lastName, department,
      regDateFrom, regDateTo, enabled } = this.filtersForm.controls;

    this.subs.add(
      this.adminService.getRegisteredAdmins(name.value, lastName.value, enabled.value, department.value,
        regDateFrom.value, regDateTo.value).subscribe(
        {
          next: (value: AdminResume[]) => {
            let requesterAccount;
            value.forEach(ar => {
              if(ar.requesterAccount) {
                requesterAccount = ar;
              }
            });

            this.admins = value;

            if(requesterAccount) {
              this.admins.splice(this.admins.indexOf(requesterAccount), 1);
            }
          },
          error: err => {
            console.error(err);
          }
        }
      )
    );
  }

  onClickAdmin(adminId: string) {
    this.router.navigate(['/admin/', 'actions', {outlets: {admin: ['users','admin', adminId]}}]);
  }
}
