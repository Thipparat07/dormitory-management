import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Tenant } from '../../../services/api/tenant/tenant';
import { Dormitory } from '../../../services/api/dormitory/dormitory';
import Swal from 'sweetalert2';
import { HeaderOwner } from '../../Dashboards/header-owner/header-owner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-room-tenant-details',
  standalone: true,
  imports: [CommonModule, HeaderOwner, FormsModule],
  templateUrl: './room-tenant-details.html',
  styleUrl: './room-tenant-details.scss',
})
export class RoomTenantDetails implements OnInit {
  dormId: number | null = null;
  roomId: number | null = null;
  roomData: any = null;
  tenantData: any = null;
  isLoading: boolean = true;

  isModalOpen: boolean = false;
  isEditMode: boolean = false;
  isDetailsModalOpen: boolean = false;
  uploadedFile: File | null = null;
  uploadedFileName: string = '';
  isSaving: boolean = false;
  isSubmitted: boolean = false;

  tenantForm: any = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idNumber: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    nationality: 'ไทย',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: ''
  };

  private tenantService = inject(Tenant);
  private dormitoryService = inject(Dormitory);
  private cdr = inject(ChangeDetectorRef);
  private ngZone = inject(NgZone);

  constructor(
    private location: Location,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    const dormIdStr = this.route.snapshot.paramMap.get('dormId');
    const roomIdStr = this.route.snapshot.paramMap.get('roomId');

    if (dormIdStr && roomIdStr) {
      this.dormId = +dormIdStr;
      this.roomId = +roomIdStr;
      this.fetchRoomDetails();
    }
  }

  fetchRoomDetails() {
    if (!this.dormId || !this.roomId) return;

    this.isLoading = true;
    this.tenantService.getRoomDetail(this.dormId, this.roomId).subscribe({
      next: (res) => {
        if (res.status === 'success') {
          this.roomData = { ...res.data.room };

          if (res.data.tenant) {
            this.tenantData = {
              ...res.data.tenant,
              status: res.data.tenant.join_status || res.data.tenant.status
            };
          } else {
            this.tenantData = null;
          }
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Fetch room details error:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
        Swal.fire({
          icon: 'error',
          title: 'ผิดพลาด',
          text: 'ไม่สามารถโหลดข้อมูลรายละเอียดห้องพักได้',
          confirmButtonText: 'ตกลง'
        });
      }
    });
  }

  approveTenant() {
    if (!this.dormId || !this.tenantData || !this.roomId) return;

    Swal.fire({
      title: 'ยืนยันการอนุมัติ?',
      text: `คุณต้องการอนุมัติคุณ ${this.tenantData.full_name} เข้าพักในห้องนี้ใช่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#32cd32',
      cancelButtonColor: '#666',
      confirmButtonText: 'ยืนยันอนุมัติ',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.tenantService.approveRequest(this.dormId!, this.tenantData.id, this.roomId!).subscribe({
          next: () => {
            this.ngZone.run(() => {
              // อัพเดท status ทันที
              this.tenantData = { ...this.tenantData, status: 'approved', join_status: 'approved' };
              this.cdr.detectChanges();

              Swal.fire({
                icon: 'success',
                title: 'อนุมัติสำเร็จ',
                text: 'ผู้เช่าสามารถเข้าใช้งานระบบได้แล้ว',
                timer: 1500,
                showConfirmButton: false
              });
              this.fetchRoomDetails();
            });
          },
          error: (err: any) => this.handleError(err)
        });
      }
    });
  }

  confirmRemoveTenant() {
    if (!this.dormId || !this.tenantData) return;

    const isPending = this.tenantData.status === 'pending';
    const isApproved = this.tenantData.status === 'approved';
    const title = isPending ? 'ยืนยันการปฏิเสธ?' : 'ยืนยันการลบผู้เช่า?';
    const text = isPending
      ? `คุณต้องการปฏิเสธคำขอเข้าพักของคุณ ${this.tenantData.full_name} ใช่หรือไม่?`
      : `คุณต้องการลบข้อมูลและย้ายคุณ ${this.tenantData.full_name} ออกจากห้องพักใช่หรือไม่?`;
    const confirmText = isPending ? 'ยืนยันปฏิเสธ' : 'ยืนยันลบข้อมูล';

    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e53935',
      cancelButtonColor: '#666',
      confirmButtonText: confirmText,
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.tenantService.removeTenant(this.dormId!, this.tenantData.id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'สำเร็จ',
              text: isPending ? 'ปฏิเสธคำขอเรียบร้อยแล้ว' : 'ลบข้อมูลผู้เช่าเรียบร้อยแล้ว',
              timer: 1500,
              showConfirmButton: false
            });
            this.fetchRoomDetails();
          },
          error: (err: any) => this.handleError(err)
        });
      }
    });
  }

  close() {
    this.location.back();
  }

  openModal(isEdit: boolean = false) {
    this.isEditMode = isEdit;
    this.isSubmitted = false;

    if (!isEdit) {
      this.tenantForm = {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        idNumber: '',
        birthDay: '',
        birthMonth: '',
        birthYear: '',
        nationality: 'ไทย',
        address: '',
        subDistrict: '',
        district: '',
        province: '',
        postalCode: ''
      };
      this.uploadedFile = null;
      this.uploadedFileName = '';
    }

    this.isModalOpen = true;
  }

  copyJoinCode() {
    if (this.roomData?.join_code) {
      const code = this.roomData.join_code;
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
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        Swal.fire({
          icon: 'success',
          title: 'คัดลอกสำเร็จ',
          text: `คัดลอกรหัส ${code} เรียบร้อยแล้ว`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.isSubmitted = false;
  }

  openDetailsModal() {
    this.isDetailsModalOpen = true;
  }

  closeDetailsModal() {
    this.isDetailsModalOpen = false;
  }

  openEditModal() { // Renamed and unified
    if (this.tenantData) {
      const nameParts = (this.tenantData.full_name || '').split(' ');

      let bDay = '', bMonth = '', bYear = '';
      if (this.tenantData.date_of_birth) {
        const date = new Date(this.tenantData.date_of_birth);
        if (!isNaN(date.getTime())) {
          bDay = String(date.getDate());
          bMonth = String(date.getMonth() + 1);
          bYear = String(date.getFullYear());
        }
      }

      let addr = this.tenantData.address || '';
      let subD = '', dist = '', prov = '', pCode = '';

      const subMatch = addr.match(/ต\.([^\s]+)/);
      const distMatch = addr.match(/อ\.([^\s]+)/);
      const provMatch = addr.match(/จ\.([^\s]+)/);
      const postMatch = addr.match(/(?:รหัสไปรษณีย์|ปณ\.)?\s*(\b\d{5}\b)/);

      if (subMatch) subD = subMatch[1];
      if (distMatch) dist = distMatch[1];
      if (provMatch) prov = provMatch[1];
      if (postMatch) pCode = postMatch[1];

      const firstPrefixIndex = addr.search(/(ต\.|อ\.|จ\.|รหัสไปรษณีย์|ปณ\.)/);
      if (firstPrefixIndex !== -1) {
        addr = addr.substring(0, firstPrefixIndex).trim();
      }

      this.tenantForm = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: this.tenantData.phone || '',
        email: this.tenantData.email || '',
        idNumber: this.tenantData.national_id || '',
        birthDay: bDay,
        birthMonth: bMonth,
        birthYear: bYear,
        nationality: this.tenantData.nationality || 'ไทย',
        address: addr,
        subDistrict: subD,
        district: dist,
        province: prov,
        postalCode: pCode
      };
    }
    this.isEditMode = true;
    this.isSubmitted = false;
    this.isModalOpen = true;
    this.isDetailsModalOpen = false;
  }

  // Placeholder for any other close logic if needed

  isFirstNameInvalid() {
    return this.isSubmitted && !this.tenantForm.firstName;
  }

  isLastNameInvalid() {
    return this.isSubmitted && !this.tenantForm.lastName;
  }

  isPhoneInvalid() {
    if (!this.isSubmitted) return false;
    if (!this.tenantForm.phone) return true;
    return this.tenantForm.phone.length < 10;
  }

  isIdNumberInvalid() {
    if (!this.isSubmitted) return false;
    if (!this.tenantForm.idNumber) return true;
    return this.tenantForm.idNumber.length < 13;
  }

  isBirthDateInvalid() {
    if (!this.isSubmitted) return false;
    return !this.tenantForm.birthDay || !this.tenantForm.birthMonth || !this.tenantForm.birthYear;
  }

  isAddressInvalid() {
    return this.isSubmitted && !this.tenantForm.address;
  }

  validateAlphabet(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^a-zA-Z\u0E00-\u0E7F\s]/g, '');
  }

  onEmailBlur() {
    const email = this.tenantForm.email;
    if (!email || this.isEditMode) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return;

    this.tenantService.searchUserByEmail(email).subscribe({
      next: (res) => {
        if (res.status === 'success' && res.data) {
          const data = res.data;

          if (data.full_name) {
            const parts = data.full_name.trim().split(/\s+/);
            this.tenantForm.firstName = parts[0] || '';
            this.tenantForm.lastName = parts.slice(1).join(' ') || '';
          }
          if (data.phone) this.tenantForm.phone = data.phone;
          if (data.national_id) this.tenantForm.idNumber = data.national_id;
          if (data.nationality) this.tenantForm.nationality = data.nationality;
          if (data.address) this.tenantForm.address = data.address;

          if (data.date_of_birth) {
            try {
              const date = new Date(data.date_of_birth);
              if (!isNaN(date.getTime())) {
                this.tenantForm.birthDay = String(date.getDate()).padStart(2, '0');
                this.tenantForm.birthMonth = String(date.getMonth() + 1).padStart(2, '0');
                this.tenantForm.birthYear = String(date.getFullYear());
              }
            } catch (e) {
              console.error('Error parsing DOB:', e);
            }
          }

          Swal.fire({
            icon: 'info',
            title: 'พบข้อมูลเดิม',
            text: 'ระบบได้เติมข้อมูลโปรไฟล์เดิมที่พบให้โดยอัตโนมัติครับ',
            timer: 2500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
          this.cdr.detectChanges();
        }
      }
    });
  }

  validateNumeric(event: any) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    input.value = value.replace(/[^0-9]/g, '');
  }

  saveTenant() {
    if (this.isSaving) return;

    this.isSubmitted = true;
    if (this.isFirstNameInvalid() || this.isLastNameInvalid() || this.isPhoneInvalid() ||
      this.isIdNumberInvalid() || this.isBirthDateInvalid() || this.isAddressInvalid()) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกข้อมูลที่จำเป็น (*) ให้ครบถ้วน',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    this.isSaving = true;

    const dob = (this.tenantForm.birthYear && this.tenantForm.birthMonth && this.tenantForm.birthDay)
      ? `${this.tenantForm.birthYear}-${String(this.tenantForm.birthMonth).padStart(2, '0')}-${String(this.tenantForm.birthDay).padStart(2, '0')}`
      : null;

    const fullAddress = [
      this.tenantForm.address,
      this.tenantForm.subDistrict ? `ต.${this.tenantForm.subDistrict}` : '',
      this.tenantForm.district ? `อ.${this.tenantForm.district}` : '',
      this.tenantForm.province ? `จ.${this.tenantForm.province}` : '',
      this.tenantForm.postalCode ? `รหัสไปรษณีย์ ${this.tenantForm.postalCode}` : ''
    ].filter(Boolean).join(' ');

    const proceedSave = (base64Image: string | null = null) => {
      const profileData = {
        full_name: `${this.tenantForm.firstName} ${this.tenantForm.lastName}`.trim(),
        phone: this.tenantForm.phone,
        national_id: this.tenantForm.idNumber,
        date_of_birth: dob,
        nationality: this.tenantForm.nationality,
        address: fullAddress,
        id_card_image: base64Image,
        email: this.tenantForm.email
      };

      if (this.isEditMode) {
        this.tenantService.updateTenantProfile(this.dormId!, this.tenantData.id, profileData).subscribe({
          next: () => {
            this.ngZone.run(() => {
              Swal.fire({ icon: 'success', title: 'สำเร็จ', text: 'อัปเดตข้อมูลผู้เช่าเรียบร้อยแล้ว', timer: 1500, showConfirmButton: false });
              this.closeModal();
              this.fetchRoomDetails();
              this.isSaving = false;
              this.cdr.detectChanges();
            });
          },
          error: (err) => this.handleError(err)
        });
      } else {
        // Use the owner-specific add endpoint which uses dormId and roomId directly
        const addPayload = {
          ...profileData,
          room_id: this.roomId
        };

        this.tenantService.addTenant(this.dormId!, addPayload).subscribe({
          next: () => {
            this.ngZone.run(() => {
              Swal.fire({ icon: 'success', title: 'สำเร็จ', text: 'เพิ่มข้อมูลผู้เช่าเรียบร้อยแล้ว', timer: 1500, showConfirmButton: false });
              this.closeModal();
              this.fetchRoomDetails();
              this.isSaving = false;
              this.cdr.detectChanges();
            });
          },
          error: (err) => this.handleError(err)
        });
      }
    };

    if (this.uploadedFile) {
      this.fileToBase64(this.uploadedFile).then(base64 => {
        proceedSave(base64);
      }).catch(err => {
        console.error('File conversion error:', err);
        proceedSave(null);
      });
    } else {
      proceedSave(this.tenantData?.id_card_image || null);
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private handleError(err: any) {
    console.error('API Error:', err);
    let message = err?.error?.message;
    if (typeof message === 'object') message = message.th || message.en;
    Swal.fire('ผิดพลาด', message || 'ไม่สามารถดำเนินการได้', 'error');
    this.isSaving = false;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'ไฟล์ไม่ถูกต้อง',
          text: 'กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, GIF) หรือไฟล์ PDF เท่านั้น',
          confirmButtonText: 'ตกลง'
        });
        event.target.value = ''; // Reset the input
        this.uploadedFileName = '';
        this.uploadedFile = null;
        return;
      }
      this.uploadedFileName = file.name;
      this.uploadedFile = file;
    }
  }
}
