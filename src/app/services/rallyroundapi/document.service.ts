import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {DocumentDto} from "../../models/documentDto";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/documents";

  constructor() { }

  getRrTermsAndConditionsHtml() {
    return this.httpClient.get<DocumentDto>(this.baseUrl + "/terms-and-conditions")
  }
}
