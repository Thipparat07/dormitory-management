import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../services/api/login/auth-service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onLogin() {

    const email = this.email.trim();
    const password = this.password.trim();

    if (!email || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'แจ้งเตือน',
        text: 'กรุณากรอกอีเมลและรหัสผ่าน',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    // เช็ครูปแบบอีเมล
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      Swal.fire({
        icon: 'warning',
        title: 'อีเมลไม่ถูกต้อง',
        text: 'กรุณากรอกอีเมลให้ถูกต้อง',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    this.isLoading = true;

    this.authService.login(email, password)
      .subscribe({
        next: (res: any) => {

          console.log('LOGIN RESPONSE:', res);

          const token = res?.token || res?.data?.token || res?.accessToken;

          if (!token || typeof token !== 'string') {
            Swal.fire({
              icon: 'error',
              title: 'Login ผิดพลาด',
              text: 'ไม่ได้รับ token จากเซิร์ฟเวอร์'
            });
            return;
          }

          localStorage.setItem('token', token);

          const decoded: any = jwtDecode(token);
          console.log('DECODED:', decoded);

          this.router.navigate(['/main']);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'ผิดพลาด',
            text: err.error?.message || 'เกิดข้อผิดพลาด',
            confirmButtonText: 'ตกลง'
          });
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }
}