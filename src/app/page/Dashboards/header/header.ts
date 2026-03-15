import { Component, Input, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/api/login/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  @Input() roomId: number | string | null = null;
  @Input() activeTab: string = '';

  isMenuOpen = false;
  isSettingsMenuOpen = false;
  isMobileMenuOpen = false; // New property for mobile nav
  userName = '';
  profilePicture: string | null = null;

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.fetchUser();
  }

  fetchUser() {
    this.authService.checkAuthStatus().subscribe({
      next: (res: any) => {
        if (res.data && res.data.user) {
          this.userName = res.data.user.full_name || res.data.user.email;
          this.profilePicture = res.data.user.profile_picture || null;
          this.cdr.detectChanges();
        }
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    // Close settings menu if open
    if (this.isMenuOpen) {
      this.isSettingsMenuOpen = false;
    }
  }

  toggleSettingsMenu() {
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
    // Close user menu if open
    if (this.isSettingsMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      this.isMenuOpen = false;
      this.isSettingsMenuOpen = false;
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  featureNotReady() {
    Swal.fire({
      icon: 'info',
      title: 'กำลังพัฒนา',
      text: 'ฟีเจอร์นี้กำลังอยู่ระหว่างการพัฒนา',
      confirmButtonText: 'ตกลง'
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'ออกจากระบบสำเร็จ',
          showConfirmButton: false,
          timer: 1500
        });
        localStorage.removeItem('isLoggedIn');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
        localStorage.removeItem('isLoggedIn');
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
