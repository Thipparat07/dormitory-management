import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router, RouterModule } from '@angular/router'; 
import { Tenant, Dormitory } from '../../../services/api/tenant/tenant';
import { Header } from '../header/header';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Header],
  templateUrl: './tenant-dashboard.html',
  styleUrl: './tenant-dashboard.scss',
})
export class TenantDashboard implements OnInit {
  dormitories: Dormitory[] = []; // Full list
  activeDormitories: Dormitory[] = []; // approved, pending
  pastDormitories: Dormitory[] = []; // moved_out, rejected
  isLoading = true;

  private router = inject(Router);
  private tenantService = inject(Tenant);
  private cdr = inject(ChangeDetectorRef);

  constructor() { }

  ngOnInit(): void {
    this.fetchDormitories();
  }

  fetchDormitories() {
    this.isLoading = true;
    this.cdr.detectChanges(); 
    this.tenantService.getMyDormitories().subscribe({
      next: (res) => {
        if (res.data && res.data.length > 0) {
          this.dormitories = res.data;
          // Categorize
          this.activeDormitories = this.dormitories.filter(d =>
            d.join_status === 'approved' || d.join_status === 'pending'
          );
          this.pastDormitories = this.dormitories.filter(d =>
            d.join_status === 'moved_out' || d.join_status === 'rejected'
          );
        } else {
          this.dormitories = [];
          this.activeDormitories = [];
          this.pastDormitories = [];
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch dormitories', err);
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  onDormClick(dorm: any) {
    if (dorm.join_status === 'pending') {
      Swal.fire({
        icon: 'warning',
        title: 'รอยืนยัน',
        text: 'กรุณารอการยืนยันจากเจ้าของหอพักก่อนเข้าดูข้อมูล',
        confirmButtonColor: '#f13d2f',
        confirmButtonText: 'ตกลง'
      });
      return;
    }
    this.router.navigate(['/dorm-info'], { queryParams: { room_id: dorm.room_id } });
  }

  goToAddDormitory() {
    this.router.navigate(['/tenant/join']);
  }
}
