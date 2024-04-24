import {CanActivateFn, Router} from '@angular/router';
import {ToastService} from "../../services/toast.service";
import {inject} from "@angular/core";
import {MPAuthService} from "../../services/rallyroundapi/mercadopago/mpauth.service";
import {catchError, map, of} from "rxjs";

export const MercadoPagoLinkedGuard: CanActivateFn = (route, state) => {
  const toastService: ToastService = inject(ToastService);
  const mpAuthService: MPAuthService = inject(MPAuthService);
  const router: Router = inject(Router);

  return mpAuthService.isAccountLinked().pipe(
    map(value => {
        if (value) {
          return true;
        }
        toastService.show("Para crear un evento primero debes vincular tu cuenta de mercado pago.",
          "bg-danger")
        return router.parseUrl("/participant/home/mock");
      }
    ),
    catchError(() => {
      toastService.show("Para crear un evento primero debes vincular tu cuenta de mercado pago.",
        "bg-danger")
      return of(router.parseUrl("/participant/home/mock"));
    })
  );
};
