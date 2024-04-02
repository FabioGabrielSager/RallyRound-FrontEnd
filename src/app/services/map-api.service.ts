import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {BingMapsApiLocationResponse} from "../models/location/BingMapsApiLocationResponse";
import {environment} from "../../enviroment/enviroment";

@Injectable({
  providedIn: 'root'
})
export class MapApiService {

  private httpClient: HttpClient = inject(HttpClient);
  private autosuggestionApiBaseUrl: string =
    `https://dev.virtualearth.net/REST/v1/Autosuggest?includeEntityTypes=Place&culture=es-AR&userRegion=ar&countryFilter=ar&key=${environment.BING_MAP_API_KEY}`;

  getAutosuggestionPlaces(query: String): Observable<BingMapsApiLocationResponse> {
    return this.httpClient.get<BingMapsApiLocationResponse>(this.autosuggestionApiBaseUrl + "&query=" + query);
  }
}
