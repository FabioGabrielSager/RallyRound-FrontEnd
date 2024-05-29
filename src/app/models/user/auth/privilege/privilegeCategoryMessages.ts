import {PrivilegeCategoryDto} from "./privilegeCategoryDto";
import {PrivilegeCategoryName} from "./privilegeCategoryName";

export const PrivilegeCategoryMessages: { [key in PrivilegeCategoryName]: string } = {
  [PrivilegeCategoryName.OVER_USERS]: 'Sobre los usuarios',
  [PrivilegeCategoryName.OVER_EVENTS]: 'Sobre los eventos',
  [PrivilegeCategoryName.OVER_STATISTICS]: 'Sobre las estadísticas'
};
