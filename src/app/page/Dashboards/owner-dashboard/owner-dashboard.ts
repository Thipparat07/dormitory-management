import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Dormitory, DormitoryResponse } from '../../../services/api/dormitory/dormitory';
import Swal from 'sweetalert2';
import { HeaderOwner } from '../header-owner/header-owner';
import { AuthService } from '../../../services/api/login/auth-service';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, HeaderOwner],
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.scss',
})
export class OwnerDashboard implements OnInit {
  isMenuOpen: boolean = false;
  isLoading: boolean = true;
  dormitories: any[] = [];

  private router = inject(Router);
  private authService = inject(AuthService);
  private dormitoryService = inject(Dormitory);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.fetchDormitories();
  }

  fetchDormitories() {
    this.isLoading = true;
    this.cdr.detectChanges(); // Trigger UI update for loading state

    this.dormitoryService.getMyDormitories().subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data) {
          const dorms = Array.isArray(res.data) ? res.data : [res.data];
          this.dormitories = dorms;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching dormitories', err);
        this.isLoading = false;
        this.cdr.detectChanges();

        Swal.fire({
          icon: 'error',
          title: 'ไม่สามารถดึงข้อมูลได้',
          text: err.error?.message?.th || 'เกิดข้อผิดพลาดในการโหลดข้อมูลหอพักของคุณ',
          confirmButtonColor: '#f13d2f'
        });
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
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

  navigateToAddBuilding() {
    this.router.navigate(['/owner/registration']);
  }

  manageDorm(dormId: number) {
    this.router.navigate(['/owner/dormitory', dormId, 'layout']);
  }

  copyJoinCode(code: string) {
    if (!code) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'คัดลอกสำเร็จ',
          text: `คัดลอกรหัส ${code} เรียบร้อยแล้ว`,
          timer: 1500,
          showConfirmButton: false
        });
      });
    }
  }
}

