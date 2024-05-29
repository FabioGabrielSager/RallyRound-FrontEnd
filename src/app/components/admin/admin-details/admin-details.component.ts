import {booleanAttribute, Component, inject, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {AdminService} from "../../../services/rallyroundapi/admin.service";
import {DepartmentService} from "../../../services/rallyroundapi/department.service";
import {ToastService} from "../../../services/toast.service";
import {BehaviorSubject, Subject, Subscription} from "rxjs";
import {PrivilegeCategoryDto} from "../../../models/user/auth/privilege/privilegeCategoryDto";
import {PrivilegeCategoryMessages} from "../../../models/user/auth/privilege/privilegeCategoryMessages";
import {PrivilegeMessages} from "../../../models/user/auth/privilege/privilegeMessages";
import {formatDate} from "@angular/common";
import {minAgeValidator} from "../../../validators/minAgeValidator";
import {AdminRegistrationRequest} from "../../../models/user/admin/adminRegistrationRequest";
import {AdminCompleteDataDto} from "../../../models/user/admin/adminCompleteDataDto";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'rr-admin-details',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './admin-details.component.html',
  styleUrl: './admin-details.component.css'
})
export class AdminDetailsComponent implements OnInit, OnDestroy {
  private adminService: AdminService = inject(AdminService);
  private departmentService: DepartmentService = inject(DepartmentService);
  private toastService: ToastService = inject(ToastService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private subs: Subscription = new Subscription();

  // Admin data
  private adminId: string = "";
  admin!: AdminCompleteDataDto;
  private adminModifiedData: AdminCompleteDataDto = {} as AdminCompleteDataDto;
  adminDataHasBeenLoaded$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  adminDataModifiedFieldCount: number = 0;
  adminPrivilegesWereModified: boolean = false;

  // Departments
  departments: string[] = [];

  // Admins privileges
  adminsPrivileges: PrivilegeCategoryDto[] = [];
  privilegesCategoriesMessages = PrivilegeCategoryMessages;
  privilegesMessages = PrivilegeMessages;

  // FORM
  fb: FormBuilder = inject(FormBuilder);
  form: FormGroup = this.fb.group({});

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.adminId = params["adminId"];
    });

    // Form initialization
    this.subs.add(this.adminDataHasBeenLoaded$.subscribe(value => {
      if (value) {
        this.form = this.fb.group({
          name: [this.admin.name, [Validators.required]],
          lastName: [this.admin.lastName, [Validators.required]],
          birthdate: [formatDate(this.admin.birthdate, 'yyyy-MM-dd', 'en'),
            [Validators.required, minAgeValidator(18)]],
          email: [this.admin.email, [Validators.required, Validators.email]],
          phoneNumber: [this.admin.phoneNumber, [Validators.required]],
          department: [this.admin.department, [Validators.required]],
          privilegesCategories: this.fb.array([])
        });

        Object.keys(this.form.controls).forEach((controlName: string) => {
          if (controlName != "privilegesCategories") {
            this.form.get(controlName)!.valueChanges.subscribe((controlValue: string) => {
              if (this.admin[controlName as keyof AdminCompleteDataDto] !== controlValue) {
                switch (controlName) {
                  case "name": {
                    if (this.adminModifiedData.name == undefined || this.adminModifiedData.name == "") {
                      this.adminDataModifiedFieldCount++;
                    }
                    if (controlValue) {
                      this.adminModifiedData.name = controlValue;
                    }
                    break;
                  }
                  case "lastName": {
                    if (this.adminModifiedData.lastName == undefined || this.adminModifiedData.lastName == "") {
                      this.adminDataModifiedFieldCount++;
                    }
                    if (controlValue) {
                      this.adminModifiedData.lastName = controlValue;
                    }
                    break;
                  }
                  case "birthdate": {
                    if (this.adminModifiedData.birthdate == undefined || this.adminModifiedData.birthdate == "") {
                      this.adminDataModifiedFieldCount++;
                    }
                    if (controlValue) {
                      this.adminModifiedData.birthdate = controlValue;
                    }
                    break;
                  }
                  case "email": {
                    if (this.adminModifiedData.email == undefined || this.adminModifiedData.email == "") {
                      this.adminDataModifiedFieldCount++;
                    }
                    if (controlValue) {
                      this.adminModifiedData.email = controlValue;
                    }
                    break;
                  }
                  case "phoneNumber": {
                    if (this.adminModifiedData.phoneNumber == undefined || this.adminModifiedData.phoneNumber == "") {
                      this.adminDataModifiedFieldCount++;
                    }
                    if (controlValue) {
                      this.adminModifiedData.phoneNumber = controlValue;
                    }
                    break;
                  }
                  case "department": {
                    if (this.adminModifiedData.department == undefined || this.adminModifiedData.department == "") {
                      this.adminDataModifiedFieldCount++;
                    }
                    if (controlValue) {
                      this.adminModifiedData.department = controlValue;
                    }
                    break;
                  }
                }
              } else {
                if (this.adminModifiedData != null) {
                  if (this.adminModifiedData[controlName as keyof AdminCompleteDataDto]) {
                    switch (controlName) {
                      case "name": {
                        this.adminModifiedData.name = "";
                        break;
                      }
                      case "lastName": {
                        this.adminModifiedData.lastName = "";
                        break;
                      }
                      case "birthdate": {
                        this.adminModifiedData.birthdate = "";
                        break;
                      }
                      case "email": {
                        this.adminModifiedData.email = "";
                        break;
                      }
                      case "phoneNumber": {
                        this.adminModifiedData.phoneNumber = "";
                        break;
                      }
                      case "department": {
                        this.adminModifiedData.department = "";
                        break;
                      }
                    }
                    this.adminDataModifiedFieldCount--;
                  }
                }
              }
            });
          }
        });
      }
    }));

    // retrieve Admin data.
    this.adminService.getAdminById(this.adminId).subscribe({
      next: value => {
        this.admin = value;
        this.adminModifiedData.privileges = JSON.parse(JSON.stringify(value.privileges));
        this.adminDataHasBeenLoaded$.next(true);
      },
      error: error => {
        console.error(error);
      }
    })

    this.subs.add(
      this.adminDataHasBeenLoaded$.subscribe(
        value => {
          if (value) {
            this.subs.add(
              this.adminService.retrieveAdminsPrivileges().subscribe({
                next: (data: PrivilegeCategoryDto[]) => {
                  this.adminsPrivileges = data;
                  this.initPrivilegeCategoriesFormArray();
                },
                error: err => console.error(err)
              })
            );
          }
        }
      )
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
    let categoryControl = new FormControl(false);
    let privilegesControls =
      this.fb.array(category.privileges.map(p => new FormControl(false)));

    const adminPrivilegeCategory = this.admin.privileges
      .find(pc => pc.categoryId === category.categoryId);

    if (adminPrivilegeCategory != undefined) {
      const adminHaveAllPrivilegesOfThisCategory =
        adminPrivilegeCategory.privileges.length === category.privileges.length;

      categoryControl =
        new FormControl(adminHaveAllPrivilegesOfThisCategory);

      if (adminHaveAllPrivilegesOfThisCategory) {
        privilegesControls =
          this.fb.array(category.privileges.map(p => new FormControl(true)));
      } else {
        privilegesControls = this.fb.array(category.privileges.map(p =>
          new FormControl(adminPrivilegeCategory.privileges
            .some(ap => ap.privilegeId === p.privilegeId))));
      }
    }

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

    privilegesControls.controls.forEach((control, index) => {
      this.subs.add(
        control.valueChanges.subscribe(
          value => {

            let privilegeCategoryToModify: PrivilegeCategoryDto = JSON.parse(JSON.stringify(category));

            if(this.adminModifiedData.privileges !== undefined) {
              const modifiedPrivilegeCategory = this.adminModifiedData.privileges
                .find(pc => pc.categoryId === category.categoryId);

              if (modifiedPrivilegeCategory) {
                privilegeCategoryToModify = modifiedPrivilegeCategory;
              } else {
                this.adminModifiedData.privileges.push(privilegeCategoryToModify);
              }
            } else {
              this.adminModifiedData.privileges = [];
              this.adminModifiedData.privileges.push(privilegeCategoryToModify);
            }

            if (!value) {
              privilegeCategoryToModify.privileges.splice(index, 1);
            } else {
              privilegeCategoryToModify.privileges.push(category.privileges[index]);
            }

            this.updateAdminPrivilegesWereModifiedVariable();
          }
        )
      );
    });

    return this.fb.group({
      category: categoryControl,
      privileges: privilegesControls
    });
  }

  private updateAdminPrivilegesWereModifiedVariable() {
    let result = false;

    if(this.adminModifiedData.privileges.length === this.admin.privileges.length) {
      this.adminModifiedData.privileges.sort((a, b) =>
        a.categoryId - b.categoryId);

      this.admin.privileges.sort((a, b) =>
        a.categoryId - b.categoryId);

      for(let i=0; i < this.adminModifiedData.privileges.length; i++) {
        if(this.adminModifiedData.privileges[i].privileges.length
          !== this.admin.privileges[i].privileges.length) {
          result = true;
        }
      }
    } else {
      result = true;
    }

    this.adminPrivilegesWereModified = result;
  }

  onClickPrivilegeCategory(categoryControl: AbstractControl, index: number) {
    const categoryFormGroup = this.privilegeCategoryControlAsFormGroup(categoryControl);
    const categoryInputValue = categoryFormGroup.controls['category'].value;

    this.privilegeControlAsFormArray(categoryFormGroup.controls['privileges']).controls.forEach(
      control => {
        const privilegeFormControl = control as FormControl;
        if (privilegeFormControl.value !== categoryInputValue) {
          privilegeFormControl.setValue(categoryInputValue);
        }
      }
    );

    const category: PrivilegeCategoryDto = this.admin.privileges[index];

    let modifiedPrivilegeCategory = this.adminModifiedData.privileges
      .find(pc => pc.categoryId === category.categoryId);

    const originalPrivilegeCategoryClone: PrivilegeCategoryDto = JSON.parse(JSON.stringify(category));
    if(categoryInputValue) {
      if(modifiedPrivilegeCategory) {
        modifiedPrivilegeCategory.privileges = originalPrivilegeCategoryClone.privileges;
      } else {
        this.adminModifiedData.privileges.push(originalPrivilegeCategoryClone);
      }
    } else {
      if(modifiedPrivilegeCategory) {
        this.adminModifiedData.privileges
          .splice(this.adminModifiedData.privileges.indexOf(modifiedPrivilegeCategory), 1);
      }
    }

    this.updateAdminPrivilegesWereModifiedVariable();
  }

  onSubmit() {
    if (this.form.invalid) {
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
    for (let i = 0; i < privilegeCategoriesFormArray.length; i++) {
      if (privilegeCategoriesFormArray.controls[i].get('category')?.value) {
        selectedPrivileges.push(this.adminsPrivileges[i]);
      } else {
        const privilegeControl =
          privilegeCategoriesFormArray.controls[i].get('privileges');
        if (privilegeControl != null) {
          const privilegesFormArray = this.privilegeControlAsFormArray(privilegeControl);
          selectedPrivileges.push(JSON.parse(JSON.stringify(this.adminsPrivileges[i])));

          for (let j = 0; j < privilegesFormArray.length; j++) {
            if (!privilegesFormArray.controls[j].value) {
              selectedPrivileges[i].privileges.splice(j, 1);
              console.log(selectedPrivileges, this.adminsPrivileges);
            }
          }
        }
      }
    }

    registrationRequest.privileges = selectedPrivileges;

    this.subs.add(this.adminService.registerAdmin(registrationRequest).subscribe({
      next: value => {
        console.log(value);
        this.toastService.show("Admin registrado con éxito", "bg-success");
      },
      error: err => {
        console.error(err);
      }
    }));
  }
}
