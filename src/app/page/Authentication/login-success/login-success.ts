import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/api/login/auth-service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login-success',
    standalone: true,
    templateUrl: './login-success.html',
    styleUrl: './login-success.scss',
})
export class LoginSuccess implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);

    ngOnInit(): void {
        // Call the checkAuthStatus API to verify the cookie is valid
        this.authService.checkAuthStatus().subscribe({
            next: (res: any) => {
                // Log in successful, backend recognized the HTTP-Only cookie
                localStorage.setItem('isLoggedIn', 'true');
                this.router.navigate(['/tenant/dashboard']);
            },
            error: (err) => {
                console.error('Auth verification failed after Google login:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถยืนยันตัวตนได้ กรุณาเข้าสู่ระบบใหม่อีกครั้ง',
                    confirmButtonText: 'ตกลง'
                });
                localStorage.removeItem('isLoggedIn');
                this.router.navigate(['/auth/login']);
            }
        });
    }
}
