import {PrivilegeCategoryDto} from "./privilegeCategoryDto";
import {PrivilegeCategoryName} from "./privilegeCategoryName";
import {PrivilegeName} from "./privilegeName";

export const PrivilegeMessages: { [key in PrivilegeName]: string } = {
  [PrivilegeName.SEARCH_USERS]: 'Buscar usuarios',
  [PrivilegeName.BAN_USERS]: 'Bloquear usuarios',
  [PrivilegeName.UNBAN_USERS]: 'Desbloquear usuarios',
  [PrivilegeName.REGISTER_ADMIN]: 'Registrar administrador',
  [PrivilegeName.MODIFY_ADMIN]: 'Modificar administrador',
  [PrivilegeName.READ_ADMINS]: 'Leer administrador',
  [PrivilegeName.DELETE_ADMIN]: 'Eliminar administrador',
  [PrivilegeName.GENERATE_STATISTICS]: 'Generar estadísticas',
  [PrivilegeName.READ_STATISTICS]: 'Leer estadísticas',
  [PrivilegeName.SEARCH_EVENTS]: 'Buscar eventos',
  [PrivilegeName.CANCEL_EVENTS]: 'Cancelar eventos'
};
