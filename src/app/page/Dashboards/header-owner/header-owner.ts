import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/api/login/auth-service';
import { ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { Dormitory } from '../../../services/api/dormitory/dormitory';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header-owner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header-owner.html',
  styleUrl: './header-owner.scss',
})
export class HeaderOwner implements OnInit {
  private _dormId: number | string | null = null;
  @Input() set dormId(value: number | string | null) {
    this._dormId = value;
    console.debug('HeaderOwner dormId changed:', value);
    if (value) {
      this.fetchDormitoryDetails();
    }
  }
  get dormId(): number | string | null {
    return this._dormId;
  }
  @Input() activeTab: string = '';

  isMenuOpen = false;
  isSettingsMenuOpen = false;
  isMobileMenuOpen = false; // New property for mobile nav
  userName = '';
  profilePicture: string | null = null;
  joinCode: string = '';

  private authService = inject(AuthService);
  private dormitoryService = inject(Dormitory);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  constructor() { }

  ngOnInit(): void {
    this.fetchUser();
    if (this.dormId) {
      this.fetchDormitoryDetails();
    }
  }

  fetchDormitoryDetails() {
    if (!this.dormId) return;
    this.dormitoryService.getDormitoryById(this.dormId).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data) {
          this.joinCode = res.data.join_code || '';
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error fetching dorm details in header', err)
    });
  }

  copyJoinCode() {
    if (this.joinCode) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.joinCode).then(() => {
          Swal.fire({
            icon: 'success',
            title: 'คัดลอกสำเร็จ',
            text: `คัดลอกรหัส ${this.joinCode} เรียบร้อยแล้ว`,
            timer: 1500,
            showConfirmButton: false
          });
        });
      }
    }
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
