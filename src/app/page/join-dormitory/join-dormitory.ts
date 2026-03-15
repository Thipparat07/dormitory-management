import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/api/login/auth-service';
import { Tenant, JoinInfoData, JoinInfoRoom } from '../../services/api/tenant/tenant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-join-dormitory',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './join-dormitory.html',
  styleUrl: './join-dormitory.scss',
})
export class JoinDormitory implements OnInit {
  isMenuOpen = false;
  userName = '';
  profilePicture: string | null = null;
  isLoading = false;

  joinCode: string = '';
  dormitoryInfo: JoinInfoData | null = null;
  floors: number[] = [];
  filteredRooms: JoinInfoRoom[] = [];

  selectedFloor: number | null = null;
  selectedRoomId: number | null = null;
  isSubmitted = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  private tenantService = inject(Tenant);
  private cdr = inject(ChangeDetectorRef);

  constructor() { }

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
      },
      error: (err: any) => {
        console.error('Fetch user failed', err);
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
      error: (err: any) => {
        console.error('Logout failed', err);
        localStorage.removeItem('isLoggedIn');
        this.router.navigate(['/auth/login']);
      }
    });
  }

  onJoin() {
    this.isSubmitted = true;
    this.cdr.detectChanges();

    if (this.selectedRoomId && this.joinCode) {
      this.isLoading = true;
      this.tenantService.joinDormitory(this.joinCode, this.selectedRoomId).subscribe({
        next: (res: any) => {
          console.log('Join success', res);
          Swal.fire({
            icon: 'success',
            title: 'ส่งคำขอสำเร็จ',
            text: 'รอการอนุมัติจากเจ้าของหอพัก',
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigate(['/tenant/dashboard']);
        },
        error: (err: any) => {
          console.error('Join error', err);
          const errorMessage = err.error?.message?.th || 'เกิดข้อผิดพลาดในการเชื่อมต่อหอพัก';
          Swal.fire({
            icon: 'error',
            title: 'ผิดพลาด',
            text: errorMessage,
            confirmButtonText: 'ตกลง'
          });
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  fetchJoinInfo() {
    if (this.joinCode.length >= 8) {
      this.tenantService.getJoinInfo(this.joinCode).subscribe({
        next: (res: any) => {
          this.dormitoryInfo = res.data;
          this.floors = res.data.floors;
          this.selectedFloor = null;
          this.filteredRooms = [];
          this.selectedRoomId = null;
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Fetch join info error', err);
          const errorMessage = err.error?.message?.th || 'ไม่พบข้อมูลหอพัก';
          Swal.fire({
            icon: 'info',
            title: 'ไม่พบข้อมูล',
            text: errorMessage,
            confirmButtonText: 'ตกลง'
          });
          this.dormitoryInfo = null;
          this.floors = [];
          this.filteredRooms = [];
          this.cdr.detectChanges();
        }
      });
    }
  }

  onFloorChange() {
    if (this.dormitoryInfo && this.selectedFloor !== null) {
      this.filteredRooms = this.dormitoryInfo.rooms.filter(
        (room: any) => room.floor_number == this.selectedFloor && room.status === 'available'
      );
      this.selectedRoomId = null;
    } else {
      this.filteredRooms = [];
    }
    this.cdr.detectChanges();
  }
}
