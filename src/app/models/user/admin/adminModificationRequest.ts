import {PrivilegeCategoryDto} from "../auth/privilege/privilegeCategoryDto";

export interface AdminModificationRequest {
  adminId: string;
  name: string;
  lastName: string;
  email: string;
  birthdate: string;
  phoneNumber: string;
  department: string;
  privileges: PrivilegeCategoryDto[];
}
