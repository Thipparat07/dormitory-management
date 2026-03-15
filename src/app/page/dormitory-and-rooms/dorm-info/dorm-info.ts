import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Tenant, MyDormitoryData } from '../../../services/api/tenant/tenant';
import { AuthService } from '../../../services/api/login/auth-service';
import { Header } from "../../Dashboards/header/header";

@Component({
  selector: 'app-dorm-info',
  standalone: true,
  imports: [CommonModule, RouterModule, Header],
  templateUrl: './dorm-info.html',
  styleUrl: './dorm-info.scss',
})
export class DormInfo implements OnInit {
  private tenantService = inject(Tenant);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cd = inject(ChangeDetectorRef);
  private authService = inject(AuthService);

  isMenuOpen = false;
  userName = '';
  roomId: number | string | null = null;
  dormInfo: MyDormitoryData | null = null;
  isLoading = true;

  ngOnInit() {
    this.fetchUser();
    this.route.queryParams.subscribe(params => {
      this.roomId = params['room_id'] ? Number(params['room_id']) : null;
      this.fetchDormInfo(this.roomId as number);
    });
  }

  fetchUser() {
    this.authService.checkAuthStatus().subscribe({
      next: (res: any) => {
        if (res.data && res.data.user) {
          this.userName = res.data.user.full_name || res.data.user.email;
          this.cd.detectChanges();
        }
      }
    });
  }

  fetchDormInfo(roomId?: number) {
    this.isLoading = true;
    this.tenantService.getMyDormitory(roomId).subscribe({
      next: (res) => {
        this.dormInfo = res.data;
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch dormitory info', err);
        this.isLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }
}
