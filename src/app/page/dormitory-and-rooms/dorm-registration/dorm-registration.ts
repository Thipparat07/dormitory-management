import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Dormitory } from '../../../services/api/dormitory/dormitory';
import { HeaderOwner } from '../../Dashboards/header-owner/header-owner';

@Component({
  selector: 'app-dorm-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HeaderOwner],
  templateUrl: './dorm-registration.html',
  styleUrl: './dorm-registration.scss',
})
export class DormRegistration {
  formData = {
    name: '',
    phone: '',
    address: '',
    number_of_floors: 1,
    rooms_per_floor: 1,
    bill_generation_day: '',
    bill_due_date: '',
    billing_type: 'postpaid',
    bill_delivery_mode: 'manual', // Default delivery mode
  };

  days: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

  isLoading = false;
  isMenuOpen = false;

  private dormitoryService = inject(Dormitory);
  private router = inject(Router);

  submitForm() {
    this.isLoading = true;

    // Cast strings to numbers for the API
    const payload = {
      ...this.formData,
      bill_generation_day: Number(this.formData.bill_generation_day),
      bill_due_date: Number(this.formData.bill_due_date),
    };

    this.dormitoryService.createDormitory(payload as any).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/owner/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating dormitory:', error);
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      },
    });
  }

  preventNonNumeric(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.router.navigate(['/auth/login']);
  }
}
