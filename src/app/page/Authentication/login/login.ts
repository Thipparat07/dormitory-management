import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../../services/api/login/auth-service';
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
export class Login implements OnInit {

  email = '';
  password = '';
  isLoading = false;
  isSubmitted = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  isEmailInvalid(): boolean {
    if (!this.isSubmitted) return false;
    if (!this.email.trim()) return true;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailPattern.test(this.email.trim());
  }

  isPasswordInvalid(): boolean {
    if (!this.isSubmitted) return false;
    return !this.password.trim();
  }

  ngOnInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      this.router.navigate(['/tenant/dashboard']);
    }
  }

  onLogin() {
    this.isSubmitted = true;

    const email = this.email.trim();
    const password = this.password.trim();

    // Check if either field is invalid using helper methods
    if (this.isEmailInvalid() || this.isPasswordInvalid()) {
      // We don't necessarily need a Swal here because inline messages will show
      return;
    }

    this.isLoading = true;

    this.authService.login(email, password)
      .subscribe({
        next: (res: any) => {

          console.log('LOGIN RESPONSE:', res);

          Swal.fire({
            icon: 'success',
            title: 'เข้าสู่ระบบสำเร็จ',
            showConfirmButton: false,
            timer: 1500
          });

          localStorage.setItem('isLoggedIn', 'true');

          this.router.navigate(['/tenant/dashboard']);
        },
        error: (err: any) => {
          let message = err?.error?.message || 'เกิดข้อผิดพลาด';
          if (typeof message === 'object') {
            message = message.th || message.en || JSON.stringify(message);
          }

          Swal.fire({
            icon: 'error',
            title: 'ผิดพลาด',
            text: message,
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