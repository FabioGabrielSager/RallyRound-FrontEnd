import { CanActivateFn } from '@angular/router';
import {AuthService} from "../../services/auth/auth.service";
import {inject} from "@angular/core";
import {ParticipantRegistrarionRequest} from "../../models/user/auth/participantRegistrarionRequest";

export const clearAuthCacheGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);

  authService.clearRegistrationRequest();

  return true;
};
