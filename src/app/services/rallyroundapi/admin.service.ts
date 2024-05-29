import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {AdminResume} from "../../models/user/admin/adminResumeDto";
import {Observable, tap} from "rxjs";
import {environment} from "../../../enviroment/enviroment";
import {PrivilegeCategoryDto} from "../../models/user/auth/privilege/privilegeCategoryDto";
import {AdminRegistrationRequest} from "../../models/user/admin/adminRegistrationRequest";
import {AuthResponse} from "../../models/user/auth/AuthResponse";
import {AdminCompleteDataDto} from "../../models/user/admin/adminCompleteDataDto";
import {AdminModificationRequest} from "../../models/user/admin/adminModificationRequest";

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/admin";

  constructor() { }


  retrieveAdminsPrivileges(): Observable<PrivilegeCategoryDto[]> {
    return this.httpClient.get<PrivilegeCategoryDto[]>(this.baseUrl + "/privileges")
  }

  registerAdmin(request: AdminRegistrationRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(this.baseUrl + "/register", request);
  }

  modifyAdmin(request: AdminModificationRequest): Observable<AdminCompleteDataDto> {
    return this.httpClient.put<AdminCompleteDataDto>(this.baseUrl + "/modify", request);
  }

  disableAdminAccount(adminId: string) {
    return this.httpClient.delete(this.baseUrl + "/disable/" + adminId);
  }

  enableAdminAccount(adminId: string) {
    return this.httpClient.put(this.baseUrl + "/enable/" + adminId, {});
  }

  getRegisteredAdmins(name: string | undefined, lastName: string | undefined, enabled: boolean | undefined,
                      department: string | undefined, registeredDateFrom: string | undefined,
                      registeredDateTo: string | undefined): Observable<AdminResume[]> {
    let baseParams: HttpParams = new HttpParams();

    if (name)
      baseParams = baseParams.append('name', name);

    if (lastName)
      baseParams = baseParams.append('lastName', lastName);

    if (enabled != undefined)
      baseParams = baseParams.append('enabled', enabled);

    if (department)
      baseParams = baseParams.append('department', department);

    if (registeredDateFrom)
      baseParams = baseParams.append('registeredDateFrom', registeredDateFrom);

    if (registeredDateTo)
      baseParams = baseParams.append('registeredDateTo', registeredDateTo);

    return this.httpClient.get<AdminResume[]>(this.baseUrl + "/find/", { params: baseParams });
  }

  getAdminById(adminId: string): Observable<AdminCompleteDataDto> {
    return  this.httpClient.get<AdminCompleteDataDto>(this.baseUrl + "/find/" + adminId);
  }
}
