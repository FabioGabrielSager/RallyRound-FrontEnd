import {inject, Injectable} from '@angular/core';
import {environment} from "../../../../enviroment/enviroment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MPAuthService {
  private baseUrl: string = environment.RR_API_BASE_URL + '/mp';
  private httpClient: HttpClient = inject(HttpClient);
  constructor() { }

  isAccountLinked(): Observable<boolean> {
    return this.httpClient.get<boolean>(this.baseUrl + "/auth/account/linked/");
  }

  getAuthUrl(): Observable<string> {
    return this.httpClient.get<string>(this.baseUrl + "/auth/url/", { responseType: 'text' as 'json' });
  }
}
