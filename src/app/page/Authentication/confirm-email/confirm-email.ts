import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/api/login/auth-service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-email.html',
  styleUrl: './confirm-email.scss',
})
export class ConfirmEmail implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  token: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    // Extract token from query params e.g. /confirm-link?token=XYZ
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      if (!this.token) {
        Swal.fire({
          icon: 'error',
          title: 'ไม่พบข้อมูลอ้างอิง',
          text: 'ข้อมูลการยืนยันไม่ถูกต้อง กรุณาล็อกอินใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง'
        }).then(() => {
          this.router.navigate(['/auth/login']);
        });
      }
    });
  }

  onConfirm(): void {
    if (!this.token) return;

    this.isLoading = true;
    this.authService.confirmGoogleLink(this.token).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'เชื่อมบัญชีสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        });
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/tenant/dashboard']);
      },
      error: (err) => {
        console.error('Link confirmation failed:', err);
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: err.error?.message || 'ไม่สามารถเชื่อมโยงบัญชีได้',
          confirmButtonText: 'ตกลง'
        });
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/auth/login']);
  }
}
