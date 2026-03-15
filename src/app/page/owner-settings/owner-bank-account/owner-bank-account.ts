import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BankPayload, Bank } from '../../../services/api/bank/bank';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderOwner } from '../../Dashboards/header-owner/header-owner';

interface BankItem {
  id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
}

@Component({
  selector: 'app-owner-bank-account',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderOwner],
  templateUrl: './owner-bank-account.html',
  styleUrl: './owner-bank-account.scss',
})
export class OwnerBankAccount implements OnInit {

  private bankService = inject(Bank);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  banks: BankItem[] = [];

  form: BankPayload = {
    dormitory_id: 0,
    bank_name: '',
    account_name: '',
    account_number: ''
  };

  editingBankId: number | null = null;

  loading = false;
  isSubmitted = false;

  isMenuOpen = false;
  isSettingsMenuOpen = false;

  isAddBankModalOpen = false;
  isEditBankModalOpen = false;

  dormitoryId: number | null = null;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      const id = params.get('dormId');

      if (!id) {
        console.error('ไม่พบ dormId');
        return;
      }

      this.dormitoryId = Number(id);

      console.log("Dorm ID:", this.dormitoryId);

      this.loadBanks();

    });

  }

  // ====================
  // LOAD BANK LIST
  // ====================

  loadBanks() {

    if (!this.dormitoryId) return;

    this.bankService.getBanks(this.dormitoryId).subscribe({
      next: (res: any) => {

        console.log("API:", res);

        this.banks = res.data ?? [];

        this.cdr.detectChanges();   // ⭐ บังคับ Angular render

      },
      error: (err: any) => {
        console.error(err);
      }
    });

  }

  // ====================
  // ADD BANK
  // ====================

  openAddBankModal() {
    this.resetForm();
    this.isSubmitted = false;
    this.isAddBankModalOpen = true;
  }

  closeAddBankModal() {
    this.isAddBankModalOpen = false;
    this.isSubmitted = false;
  }

  saveBank() {
    if (!this.dormitoryId) {
      console.error('dormitoryId ไม่มีค่า');
      return;
    }

    this.isSubmitted = true;

    if (!this.form.bank_name || !this.form.account_name || !this.form.account_number) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกข้อมูลบัญชีธนาคารให้ครบทุกช่อง',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    const payload: BankPayload = {
      dormitory_id: this.dormitoryId,
      bank_name: this.form.bank_name,
      account_name: this.form.account_name,
      account_number: this.form.account_number
    };

    this.loading = true;
    this.bankService.createBank(payload).subscribe({
      next: () => {
        this.loading = false;
        this.isAddBankModalOpen = false; // Close directly
        this.cdr.detectChanges();
        
        this.loadBanks();

        Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ',
          text: 'เพิ่มบัญชีธนาคารเรียบร้อยแล้ว',
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Create bank failed:', err);
        const errorMessage = err.error?.message?.th || err.error?.message || 'ไม่สามารถเพิ่มบัญชีธนาคารได้';

        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: errorMessage
        });
      }
    });
  }

  // ====================
  // EDIT BANK
  // ====================

  openEditBankModal(bank: BankItem) {
    this.editingBankId = bank.id;
    this.isSubmitted = false;
    this.form = {
      dormitory_id: this.dormitoryId ?? 0,
      bank_name: bank.bank_name,
      account_name: bank.account_name,
      account_number: bank.account_number
    };

    this.isEditBankModalOpen = true;
  }

  closeEditBankModal() {
    this.isEditBankModalOpen = false;
    this.isSubmitted = false;
  }

  updateBank() {
    if (!this.editingBankId || !this.dormitoryId) return;

    this.isSubmitted = true;

    if (!this.form.bank_name || !this.form.account_name || !this.form.account_number) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกข้อมูลบัญชีธนาคารให้ครบทุกช่อง',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    const payload = {
      dormitory_id: this.dormitoryId,
      bank_name: this.form.bank_name,
      account_name: this.form.account_name,
      account_number: this.form.account_number
    };

    this.loading = true;
    this.bankService.updateBank(this.editingBankId, payload)
      .subscribe({
        next: () => {
          this.loading = false;
          this.isEditBankModalOpen = false; // Close directly
          this.cdr.detectChanges();
          
          this.loadBanks();
          
          Swal.fire({
            icon: 'success',
            title: 'อัปเดตสำเร็จ',
            text: 'แก้ไขข้อมูลบัญชีธนาคารเรียบร้อยแล้ว',
            timer: 1500,
            showConfirmButton: false
          });
        },
        error: (err: any) => {
          this.loading = false;
          console.error('Update bank failed:', err);
          const errorMessage = err.error?.message?.th || err.error?.message || 'ไม่สามารถแก้ไขข้อมูลได้';
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: errorMessage
          });
        }
      });
  }

  // ====================
  // DELETE
  // ====================

  deleteBank(id: number) {
    Swal.fire({
      title: 'ต้องการลบหรือไม่?',
      text: 'บัญชีธนาคารนี้จะถูกลบ',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f13d2f',
      cancelButtonColor: '#999',
      confirmButtonText: 'ลบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bankService.deleteBank(id).subscribe({
          next: () => {
            // Update local state immediately for fast UI feedback
            this.banks = this.banks.filter(b => b.id !== id);
            this.cdr.detectChanges();

            Swal.fire({
              icon: 'success',
              title: 'ลบสำเร็จ',
              timer: 1500,
              showConfirmButton: false
            });

            this.loadBanks(); // Sync with server for consistency
          },
          error: (err: any) => {
            console.error('Delete bank failed:', err);
            const errorMessage = err.error?.message?.th || err.error?.message || 'ไม่สามารถลบบัญชีธนาคารได้';
            Swal.fire({
              icon: 'error',
              title: 'เกิดข้อผิดพลาด',
              text: errorMessage
            });
          }
        });
      }
    });
  }

  // ====================
  // UTIL
  // ====================

  resetForm() {

    this.form = {
      dormitory_id: this.dormitoryId ?? 0,
      bank_name: '',
      account_name: '',
      account_number: ''
    };

  }

  toggleMenu() {

    this.isMenuOpen = !this.isMenuOpen;
    this.isSettingsMenuOpen = false;

  }

  toggleSettingsMenu() {

    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
    this.isMenuOpen = false;

  }

  logout() {

    this.router.navigate(['/auth/login']);

  }

  preventNonNumeric(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  sanitizeAccountNumber(): void {
    if (this.form.account_number) {
      this.form.account_number = this.form.account_number.replace(/\D/g, '');
    }
  }

  preventNumeric(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
    // Prevent digits 0-9
    if (charCode >= 48 && charCode <= 57) {
      event.preventDefault();
    }
  }

  sanitizeAccountName(): void {
    if (this.form.account_name) {
      // Remove digits 0-9
      this.form.account_name = this.form.account_name.replace(/[0-9]/g, '');
    }
  }

  trackBank(index: number, bank: BankItem) {
    return bank.id;
  }

}