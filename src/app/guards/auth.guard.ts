import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/api/login/auth-service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.checkAuthStatus().pipe(
        map(res => {
            if (res) {
                localStorage.setItem('isLoggedIn', 'true');
                return true;
            }
            localStorage.removeItem('isLoggedIn');
            return router.createUrlTree(['/auth/login']);
        }),
        catchError(() => {
            localStorage.removeItem('isLoggedIn');
            return of(router.createUrlTree(['/auth/login']));
        })
    );
};