import {RegistrationRequest} from "../auth/registrationRequest";
import {PrivilegeCategoryDto} from "../auth/privilege/privilegeCategoryDto";

export class AdminRegistrationRequest extends RegistrationRequest {
  phoneNumber: string = "";
  department: string = "";
  privileges: PrivilegeCategoryDto[] = [];
}
