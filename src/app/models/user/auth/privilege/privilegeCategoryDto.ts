import {PrivilegeDto} from "./privilegeDto";
import {PrivilegeCategoryName} from "./privilegeCategoryName";

export interface PrivilegeCategoryDto {
  categoryId: number;
  categoryName: PrivilegeCategoryName;
  privileges: PrivilegeDto[];
}
