import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {SearchResultsListComponent} from "../../shared/search-results-list/search-results-list.component";
import {formatDate} from "@angular/common";
import {minAgeValidator} from "../../../validators/minAgeValidator";
import {passwordMatchValidator} from "../../../validators/passwordMatchValidator";
import {AuthService} from "../../../services/auth/auth.service";
import {PrivilegeCategoryDto} from "../../../models/user/auth/privilege/privilegeCategoryDto";
import {PrivilegeDto} from "../../../models/user/auth/privilege/privilegeDto";
import {Subscription} from "rxjs";
import {PrivilegeCategoryMessages} from "../../../models/user/auth/privilege/privilegeCategoryMessages";
import {PrivilegeMessages} from "../../../models/user/auth/privilege/privilegeMessages";
import {AdminRegistrationRequest} from "../../../models/user/admin/adminRegistrationRequest";
import {ToastService} from "../../../services/toast.service";
import {AdminService} from "../../../services/rallyroundapi/admin.service";
import {DepartmentService} from "../../../services/rallyroundapi/department.service";

@Component({
  selector: 'rr-register-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SearchResultsListComponent
  ],
  templateUrl: './register-admin.component.html',
  styleUrl: './register-admin.component.css'
})
export class RegisterAdminComponent implements OnInit,OnDestroy {
  private adminService: AdminService = inject(AdminService);
  private departmentService: DepartmentService = inject(DepartmentService);
  private toastService: ToastService = inject(ToastService);
  private subs: Subscription = new Subscription();

  // Departments
  departments: string[] = [];

  // Admins privileges
  adminsPrivileges: PrivilegeCategoryDto[] = [];
  privilegesCategoriesMessages = PrivilegeCategoryMessages;
  privilegesMessages = PrivilegeMessages;

  // Password
  passwordIsHide: boolean = true;
  confirmPasswordIsHide: boolean = true;

  // FORM
  birthdateControlInitialValue: Date = new Date();
  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({});

  ngOnInit(): void {
    // Form initialization
    const today = new Date();
    this.birthdateControlInitialValue = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    this.form = this.fb.group({
      name: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      birthdate: [formatDate(this.birthdateControlInitialValue, 'yyyy-MM-dd', 'en'),
        [Validators.required, minAgeValidator(18)]],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(5)]],
      confirmPassword: ["", [Validators.required]],
      department: ["", [Validators.required]],
      privilegesCategories: this.fb.array([])
    }, {validators: passwordMatchValidator});

    this.subs.add(
      this.adminService.retrieveAdminsPrivileges().subscribe({
        next: (data: PrivilegeCategoryDto[]) => {
          this.adminsPrivileges = data;
          this.initPrivilegeCategoriesFormArray();
        },
        error: err => console.error(err)
      })
    );

    this.subs.add(
      this.departmentService.getDepartments().subscribe({
        next: (departments: string[]) => this.departments = departments,
        error: err => console.error(err)
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  get privilegesCategoriesAsFormArray() {
    return this.form.controls['privilegesCategories'] as FormArray;
  }

  privilegeCategoryControlAsFormGroup(category: AbstractControl) {
    return category as FormGroup;
  }

  privilegeControlAsFormArray(privilege: AbstractControl) {
    return privilege as FormArray;
  }

  private initPrivilegeCategoriesFormArray() {
    this.adminsPrivileges.forEach(category => {
      this.privilegesCategoriesAsFormArray.push(this.createPrivilegeCategoryFormGroup(category));
    });
  }

  private createPrivilegeCategoryFormGroup(category: PrivilegeCategoryDto) {
    const categoryControl = new FormControl(false);
    const privilegesControls =
      this.fb.array(category.privileges.map(p => new FormControl(false)));

    this.subs.add(
      privilegesControls.valueChanges.subscribe(
        (controls) => {
          const areAllChecked = controls.every((value) => {
            return value === true;
          });

          if (areAllChecked !== categoryControl.value) {
            categoryControl.setValue(areAllChecked);
          }
        }
      )
    );

    return this.fb.group({
      category: categoryControl,
      privileges: privilegesControls
    });
  }

  onClickPrivilegeCategory(category: AbstractControl) {
    const categoryFormGroup = this.privilegeCategoryControlAsFormGroup(category);
    const categoryInputValue = categoryFormGroup.controls['category'].value;

    this.privilegeControlAsFormArray(categoryFormGroup.controls['privileges']).controls.forEach(
      control => {
        const privilegeFormControl = control as FormControl;
        if(privilegeFormControl.value !== categoryInputValue) {
          privilegeFormControl.setValue(categoryInputValue);
        }
      }
    )
  }

  togglePasswordVisibility() {
    this.passwordIsHide = !this.passwordIsHide;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordIsHide = !this.confirmPasswordIsHide;
  }

  onSubmit() {
    if(this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    let registrationRequest = new AdminRegistrationRequest();

    registrationRequest.name = this.form.controls['name'].value;
    registrationRequest.lastName = this.form.controls['lastName'].value;
    registrationRequest.birthdate = this.form.controls['birthdate'].value;
    registrationRequest.email = this.form.controls['email'].value;
    registrationRequest.password = this.form.controls['password'].value;
    registrationRequest.phoneNumber = this.form.controls['phone'].value;
    registrationRequest.department = this.form.controls['department'].value;

    let selectedPrivileges: PrivilegeCategoryDto[] = [];
    const privilegeCategoriesFormArray = this.privilegesCategoriesAsFormArray;
    for(let i=0; i < privilegeCategoriesFormArray.length; i++) {
      if(privilegeCategoriesFormArray.controls[i].get('category')?.value) {
        selectedPrivileges.push(this.adminsPrivileges[i]);
      } else {
        const privilegeControl =
          privilegeCategoriesFormArray.controls[i].get('privileges');
        if(privilegeControl != null) {
          const privilegesFormArray = this.privilegeControlAsFormArray(privilegeControl);
          selectedPrivileges.push(JSON.parse(JSON.stringify(this.adminsPrivileges[i])));

          for(let j=0; j < privilegesFormArray.length; j++) {
            if(!privilegesFormArray.controls[j].value) {
              selectedPrivileges[i].privileges.splice(j,1);
            }
          }
        }
      }
    }

    registrationRequest.privileges = selectedPrivileges;

    this.subs.add(this.adminService.registerAdmin(registrationRequest).subscribe({
      next: value => {
        this.toastService.show("Admin registrado con éxito", "bg-success");
      },
      error: err => {
        console.error(err);
      }
    }));
  }
}
