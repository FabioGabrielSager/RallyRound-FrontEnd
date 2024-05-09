import {EventInscriptionStatus} from "./eventInscriptionStatus";
import {EventInscriptionResponse} from "./EventInscriptionResponse";

export interface CreateEventInscriptionResponse extends EventInscriptionResponse {
  requiresPayment: boolean,
  paymentLink: string
}
