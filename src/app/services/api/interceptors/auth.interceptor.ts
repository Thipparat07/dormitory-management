import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    const authReq = req.clone({
        withCredentials: true
    });

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // If the backend returns 401 Unauthorized, it means cookie is missing or invalid
            if (error.status === 401) {
                localStorage.removeItem('isLoggedIn');
                router.navigate(['/auth/login']);
            }
            return throwError(() => error);
        })
    );
};
