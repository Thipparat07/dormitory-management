import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { Dormitory } from '../../../services/api/dormitory/dormitory';
import { HeaderOwner } from '../../Dashboards/header-owner/header-owner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-room-type-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderOwner],
  templateUrl: './room-type-management.html',
  styleUrl: './room-type-management.scss',
})
export class RoomTypeManagement implements OnInit {
  dormId: number | null = null;
  roomTypes: any[] = [];
  isLoading = false;

  showModal = false;
  isEditMode = false;
  editingTypeId: number | null = null;
  isSubmitted = false;

  typeForm = {
    name: '',
    price: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dormitoryService: Dormitory,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('dormId');
      if (id) {
        this.dormId = +id;
        this.fetchRoomTypes();
      }
    });
  }

  fetchRoomTypes() {
    if (!this.dormId) return;
    this.isLoading = true;
    this.dormitoryService.getRoomTypes(this.dormId).subscribe({
      next: (res) => {
        this.roomTypes = res.data || [];
        this.isLoading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch room types', err);
        this.isLoading = false;
      }
    });
  }

  openAddModal() {
    this.isEditMode = false;
    this.editingTypeId = null;
    this.typeForm = { name: '', price: 0 };
    this.isSubmitted = false;
    this.showModal = true;
  }

  openEditModal(type: any) {
    this.isEditMode = true;
    this.editingTypeId = type.id;
    this.typeForm = { name: type.name, price: type.price };
    this.isSubmitted = false;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.isSubmitted = false;
  }

  saveRoomType() {
    if (!this.dormId) return;

    this.isSubmitted = true;

    if (!this.typeForm.name || this.typeForm.price === null || this.typeForm.price === undefined || this.typeForm.price < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกชื่อและราคาให้ถูกต้อง',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    if (this.isEditMode && this.editingTypeId) {
      this.dormitoryService.updateRoomType(this.dormId, this.editingTypeId, this.typeForm).subscribe({
        next: () => {
          this.closeModal();
          this.fetchRoomTypes();
          this.cd.detectChanges();

          Swal.fire({
            icon: 'success',
            title: 'แก้ไขสำเร็จ',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err: any) => {
          console.error('Failed to update room type', err);
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถแก้ไขข้อมูลได้'
          });
        }
      });
    } else {
      this.dormitoryService.createRoomType(this.dormId, this.typeForm).subscribe({
        next: () => {
          this.closeModal();
          this.fetchRoomTypes();
          this.cd.detectChanges();

          Swal.fire({
            icon: 'success',
            title: 'เพิ่มสำเร็จ',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err: any) => {
          console.error('Failed to create room type', err);
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถเพิ่มข้อมูลได้'
          });
        }
      });
    }
  }

  deleteRoomType(typeId: number) {
    if (!this.dormId) return;

    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: 'คุณแน่ใจหรือไม่ว่าต้องการลบประเภทห้องนี้?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f13d2f',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed && this.dormId) {
        this.dormitoryService.deleteRoomType(this.dormId, typeId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'ลบสำเร็จ',
              timer: 1500,
              showConfirmButton: false
            });
            this.fetchRoomTypes();
            this.cd.detectChanges();
          },
          error: (err) => {
            console.error('Failed to delete room type', err);
            Swal.fire({
              icon: 'error',
              title: 'ไม่สามารถลบได้',
              text: 'เนื่องจากมีห้องที่ใช้งานประเภทนี้อยู่'
            });
          }
        });
      }
    });
  }

  goBack() {
    if (this.dormId) {
      this.router.navigate(['/owner/dormitory', this.dormId, 'room-booking']);
    }
  }

  getAveragePrice(): number {
    if (this.roomTypes.length === 0) return 0;
    const total = this.roomTypes.reduce((sum, type) => sum + Number(type.price), 0);
    return Math.round(total / this.roomTypes.length);
  }

  getRandomColor(seed: number, alpha: number = 1): string {
    const colors = [
      `rgba(33, 150, 243, ${alpha})`, // Blue
      `rgba(76, 175, 80, ${alpha})`,  // Green
      `rgba(156, 39, 176, ${alpha})`, // Purple
      `rgba(255, 152, 0, ${alpha})`,   // Orange
      `rgba(0, 188, 212, ${alpha})`    // Cyan
    ];
    return colors[(seed || 0) % colors.length];
  }

  preventNumeric(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    // Prevent digits 0-9
    if (charCode >= 48 && charCode <= 57) {
      event.preventDefault();
    }
  }

  sanitizeRoomTypeName(): void {
    if (this.typeForm.name) {
      // Remove digits 0-9
      this.typeForm.name = this.typeForm.name.replace(/[0-9]/g, '');
    }
  }
}
