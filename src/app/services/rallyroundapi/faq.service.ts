import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {Observable} from "rxjs";
import {FaqDto} from "../../models/faqDto";

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + "/faq";

  constructor() { }

  getFAQs(): Observable<FaqDto[]> {
    return this.httpClient.get<FaqDto[]>(this.baseUrl);
  }
}
