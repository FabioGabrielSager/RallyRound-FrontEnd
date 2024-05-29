import {PrivilegeCategoryDto} from "../auth/privilege/privilegeCategoryDto";
import {AdminResume} from "./adminResumeDto";

export interface AdminCompleteDataDto extends AdminResume {
  email: string;
  registrationDate: string;
  birthdate: string;
  phoneNumber: string;
  privileges: PrivilegeCategoryDto[];
}
