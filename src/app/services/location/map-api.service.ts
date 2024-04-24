import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../enviroment/enviroment";
import {Place} from "../../models/location/place";
import {AddressEntity} from "../../models/location/AddressEntity";

@Injectable({
  providedIn: 'root'
})
export class MapApiService {

  private httpClient: HttpClient = inject(HttpClient);
  private baseUrl: string = environment.RR_API_BASE_URL + '/location';

  getAutosuggestionPlaces(query: String): Observable<Place[]> {
    return this.httpClient.get<Place[]>(
      this.baseUrl + "/autosuggest/places/" + query);
  }

  getAutosuggestionAddresses(query: string): Observable<AddressEntity[]> {
    return this.httpClient.get<AddressEntity[]>(
      this.baseUrl + "/autosuggest/addresses/" + query)
  }
}
