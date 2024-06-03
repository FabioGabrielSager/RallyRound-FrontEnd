import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {environment} from "../../../enviroment/enviroment";
import {map, Observable, tap} from "rxjs";
import {CreateEventRequest} from "../../models/event/createEventRequest";
import {EventResponse} from "../../models/event/eventResponse";
import {EventsResumesPage} from "../../models/event/EventsResumesPage";
import {EventInscriptionStatus} from "../../models/event/eventInscriptionStatus";
import {MPPaymentStatus} from "../../models/MPPaymentStatus";
import {CachedEvent} from "../../models/event/cachedEvent";
import {EventResponseForEventCreators} from "../../models/event/eventResponseForEventCreators";
import {EventResponseForParticipants} from "../../models/event/eventResponseForParticipants";
import {EventFeedbackRequest} from "../../models/event/eventFeedbackRequest";
import {EventModificationRequest} from "../../models/event/eventModificationRequest";

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private httpClient: HttpClient = inject(HttpClient);
  private baseUrlEventEndpoint: string = environment.RR_API_BASE_URL + "/events";
  private baseUrlParticipantEndpoint: string = environment.RR_API_BASE_URL + "/participant";
  private _lastRequestedEvent: CachedEvent =
    {event: null, isEventCreatedByCurrentUser: undefined};

  constructor() {
    const lastRequestedEvent = sessionStorage.getItem("lastRequestedEvent");
    if (lastRequestedEvent != null) {
      this._lastRequestedEvent = JSON.parse(lastRequestedEvent);
    }
  }

  // Retrieves the last requested event if the id of the current requested event matches with the id
  // of the last requested event, otherwise returns null
  getLastRequestedEvent(eventId: string) {
    if (this._lastRequestedEvent.event != null && eventId === this._lastRequestedEvent.event.id) {
      return this._lastRequestedEvent;
    }
    return null;
  }

  set lastRequestedEvent(value: CachedEvent) {
    this._lastRequestedEvent = value;
  }

  // Creates a new event using the provided request data.
  // Upon successful creation, updates the lastRequestedEvent variable with the details of the newly created event
  // and sets isEventCreatedByCurrentUser to true since the current user is the creator of the event.
  // Note: Changes to the lastRequestedEvent variable occur only when the creation request is successful
  // and retrieves non-null results.
  createEvent(request: CreateEventRequest): Observable<EventResponseForEventCreators> {
    return this.httpClient.post<EventResponseForEventCreators>(this.baseUrlEventEndpoint + "/create/", request)
      .pipe(
        tap(value => {
          if (value != null) {
            this._lastRequestedEvent.event = value as EventResponseForParticipants;
            this._lastRequestedEvent.isEventCreatedByCurrentUser = true;
            sessionStorage.setItem('lastRequestedEvent', JSON.stringify(this._lastRequestedEvent));
          }
        }),
        map(value => {
          if(value.startingHours.length > 1 && value.startingHoursTimesVoted != null)
            value.startingHoursTimesVoted = new Map<string, number>(Object.entries(value.startingHoursTimesVoted));
          return value;
        })
      );
  }

  modifyEvent(request: EventModificationRequest): Observable<EventResponseForEventCreators> {
    return this.httpClient.patch<EventResponseForEventCreators>(this.baseUrlEventEndpoint + "/modify/", request)
      .pipe(
        tap(value => {
          if (value != null) {
            this._lastRequestedEvent.event = value as EventResponseForParticipants;
            this._lastRequestedEvent.isEventCreatedByCurrentUser = true;
            sessionStorage.setItem('lastRequestedEvent', JSON.stringify(this._lastRequestedEvent));
          }
        }),
        map(value => {
          if(value.startingHours.length > 1 && value.startingHoursTimesVoted != null)
            value.startingHoursTimesVoted = new Map<string, number>(Object.entries(value.startingHoursTimesVoted));
          return value;
        })
      );
  }

  cancelEvent(eventId: string) {
    return this.httpClient.patch(this.baseUrlEventEndpoint + "/cancel/" + eventId, {});
  }

  findEvents(activity: string | undefined, neighborhood: string | undefined, locality: string | undefined,
             adminSubdistrict: string | undefined, adminDistrict: string | undefined, dateFrom: string | null,
             dateTo: string | null, showOnlyAvailableEvents: boolean | undefined,
             hours: string[], limit: number, page: number): Observable<EventsResumesPage> {
    let baseParams: HttpParams = new HttpParams();

    if (activity)
      baseParams = baseParams.append('activity', activity);

    if (neighborhood)
      baseParams = baseParams.append('neighborhood', neighborhood);

    if (locality)
      baseParams = baseParams.append('locality', locality);

    if (adminSubdistrict)
      baseParams = baseParams.append('adminSubdistrict', adminSubdistrict);

    if (adminDistrict)
      baseParams = baseParams.append('adminDistrict', adminDistrict);

    if (dateFrom)
      baseParams = baseParams.append('dateFrom', dateFrom);

    if (dateTo)
      baseParams = baseParams.append('dateTo', dateTo)

    if (hours.length > 0)
      baseParams = baseParams.append('hours', hours.join(','));

    if (showOnlyAvailableEvents)
      baseParams = baseParams.append('showOnlyAvailableEvents', showOnlyAvailableEvents)

    baseParams = baseParams.append('limit', limit);
    baseParams = baseParams.append('page', page);

    return this.httpClient.get<EventsResumesPage>(this.baseUrlEventEndpoint + "/find/", {
      params: baseParams
    });
  }

  // Retrieves the details of an event by its ID.
  // Updates the lastRequestedEvent variable with the details of the retrieved event
  // and sets isEventCreatedByCurrentUser to false since the current user is the creator of the event, if the event is found.
  // Note: Changes to the lastRequestedEvent variable occur only when the request is successful
  // and retrieves non-null results.
  findEventWithCreatorReputationById(eventId: string): Observable<EventResponse> {
    return this.httpClient.get<EventResponse>(this.baseUrlEventEndpoint + "/find/" + eventId)
      .pipe(
        tap(value => {
          if (value != null) {
            this._lastRequestedEvent.event = value as EventResponseForParticipants;
            this._lastRequestedEvent.isEventCreatedByCurrentUser = false;
            sessionStorage.setItem('lastRequestedEvent', JSON.stringify(this._lastRequestedEvent));
          }
        }),
        map(value => {
          if(value.startingHours.length > 1 && value.startingHoursTimesVoted != null)
            value.startingHoursTimesVoted = new Map<string, number>(Object.entries(value.startingHoursTimesVoted));
          return value;
        })
      );
  }

  // Retrieves the details of an event created by the current user by its ID.
  // Updates the lastRequestedEvent variable with the details of the retrieved event
  // and sets isEventCreatedByCurrentUser to true since the current user is the creator of the event, if the event is found.
  // Note: Changes to the lastRequestedEvent variable occur only when the request is successful
  // and retrieves non-null results.
  getCurrentUserCreatedEvent(eventId: string): Observable<EventResponseForEventCreators> {
    return this.httpClient.get<EventResponseForEventCreators>(
      `${this.baseUrlParticipantEndpoint}/events/${eventId}/created/`)
      .pipe(
        tap(value => {
          if (value != null) {
            this._lastRequestedEvent.event = value as EventResponseForParticipants;
            this._lastRequestedEvent.isEventCreatedByCurrentUser = true;
            sessionStorage.setItem('lastRequestedEvent', JSON.stringify(this._lastRequestedEvent));
          }
        }),
        map(value => {
          if(value.startingHours.length > 1 && value.startingHoursTimesVoted != null)
            value.startingHoursTimesVoted = new Map<string, number>(Object.entries(value.startingHoursTimesVoted));
          return value;
        })
      );
  }

  // Retrieves the events resumes which the user is participant or has a registration (not yet accepted) in
  getCurrentUserParticipatingEvents(createdAt: Date | null, status: EventInscriptionStatus | null,
                                    paymentStatus: MPPaymentStatus | null, activity: string | undefined, neighborhood: string | undefined,
                                    locality: string | undefined, adminSubdistrict: string | undefined, adminDistrict: string | undefined,
                                    dateFrom: string | null, dateTo: string | null, hours: string[]):
    Observable<EventsResumesPage> {
    let baseParams: HttpParams = new HttpParams();

    if (createdAt)
      baseParams.append("createdAt", createdAt.toISOString());

    if (status)
      baseParams.append("status", status);

    if (paymentStatus)
      baseParams.append("paymentStatus", paymentStatus);

    if (activity)
      baseParams = baseParams.append('activity', activity);

    if (neighborhood)
      baseParams = baseParams.append('neighborhood', neighborhood);

    if (locality)
      baseParams = baseParams.append('locality', locality);

    if (adminSubdistrict)
      baseParams = baseParams.append('adminSubdistrict', adminSubdistrict);

    if (adminDistrict)
      baseParams = baseParams.append('adminDistrict', adminDistrict);

    if (dateFrom)
      baseParams = baseParams.append('dateFrom', dateFrom);

    if (dateTo)
      baseParams = baseParams.append('dateTo', dateTo)

    if (hours.length > 0)
      baseParams = baseParams.append('hours', hours.join(','));

    return this.httpClient.get<EventsResumesPage>(`${this.baseUrlParticipantEndpoint}/events/singedup`,
      {params: baseParams});
  }

  getCurrentUserCreatedEvents(activity: string | undefined, neighborhood: string | undefined, locality: string | undefined,
                              adminSubdistrict: string | undefined, adminDistrict: string | undefined, dateFrom: string | null,
                              dateTo: string | null, hours: string[]): Observable<EventsResumesPage> {
    let baseParams: HttpParams = new HttpParams();

    if (activity)
      baseParams = baseParams.append('activity', activity);

    if (neighborhood)
      baseParams = baseParams.append('neighborhood', neighborhood);

    if (locality)
      baseParams = baseParams.append('locality', locality);

    if (adminSubdistrict)
      baseParams = baseParams.append('adminSubdistrict', adminSubdistrict);

    if (adminDistrict)
      baseParams = baseParams.append('adminDistrict', adminDistrict);

    if (dateFrom)
      baseParams = baseParams.append('dateFrom', dateFrom);

    if (dateTo)
      baseParams = baseParams.append('dateTo', dateTo)

    if (hours.length > 0)
      baseParams = baseParams.append('hours', hours.join(','));

    return this.httpClient.get<EventsResumesPage>(`${this.baseUrlParticipantEndpoint}/events/created`,
      {params: baseParams});
  }

  // Retrieves the details of an event in which the current user is participating.
  // Updates the lastRequestedEvent variable with the details of the retrieved event
  // Sets isEventCreatedByCurrentUser to false since the current user is not the creator of the event
  // Note: Changes to the lastRequestedEvent variable occur only when the request is successful
  // and retrieves non-null results.
  getCurrentUserParticipatingEvent(eventId: string):
    Observable<EventResponseForParticipants> {
    return this.httpClient
      .get<EventResponseForParticipants>(
        `${this.baseUrlParticipantEndpoint}/events/${eventId}/enrolled/`)
      .pipe(
        tap(value => {
            if (value != null) {
              this._lastRequestedEvent.event = value;
              this._lastRequestedEvent.isEventCreatedByCurrentUser = false;
              sessionStorage.setItem('lastRequestedEvent', JSON.stringify(this._lastRequestedEvent));
            }
          }
        ),
        map(value => {
          if(value.startingHours.length > 1 && value.startingHoursTimesVoted != null)
            value.startingHoursTimesVoted = new Map<string, number>(Object.entries(value.startingHoursTimesVoted));
          return value;
        })
      );
  }

  sendEventFeedback(request: EventFeedbackRequest): Observable<any> {
    return this.httpClient.post(this.baseUrlEventEndpoint + "/feedback/", request);
  }
}
