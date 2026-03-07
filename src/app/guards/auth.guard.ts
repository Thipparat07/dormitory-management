import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const token = localStorage.getItem('token');

    if (!token) return router.createUrlTree(['/login']);

    try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return router.createUrlTree(['/login']);
        }
        return true;
    } catch {
        return router.createUrlTree(['/login']);
    }
};