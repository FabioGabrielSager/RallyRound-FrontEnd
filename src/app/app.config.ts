import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {jwtInterceptorInterceptor} from "./services/auth/interceptors/jwt-interceptor.interceptor";
import {RxStompService} from "./services/rxstomp/rx-stomp.service";
import {rxStompServiceFactory} from "./services/rxstomp/rx-stomp-service-factory";
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptorInterceptor])
    ),
    { provide: RxStompService, useFactory: rxStompServiceFactory }, provideCharts(withDefaultRegisterables())
  ]
};
