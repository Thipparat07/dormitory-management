import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Header } from '../Dashboards/header/header';

@Component({
  selector: 'app-maintenance-report',
  standalone: true,
  imports: [CommonModule, FormsModule, Header, RouterModule],
  templateUrl: './maintenance-report.html',
  styleUrl: './maintenance-report.scss',
})
export class MaintenanceReport implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  roomId: number | string | null = null;
  isAddReportModalOpen = false;
  isAddReportMenuOpen = false;
  isDetailModalOpen = false;
  isEditMode = false;
  selectedImage: string | ArrayBuffer | null = null;
  detailModalData: any = null;

  reports = [
    {
      room: 'ห้อง 509 แจ้งซ่อม',
      title: 'แอร์พัง',
      status: 'pending',
      statusText: 'รอการยืนยัน',
      image: 'https://cdn-icons-png.flaticon.com/512/10603/10603072.png'
    }
  ];

  constructor() { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.roomId = params['room_id'] || null;
    });
  }

  toggleAddReportMenu() {
    this.isAddReportMenuOpen = !this.isAddReportMenuOpen;
  }

  openAddReportModal() {
    this.isAddReportModalOpen = true;
    this.isAddReportMenuOpen = false;
  }

  closeAddReportModal() {
    this.isAddReportModalOpen = false;
    this.selectedImage = null;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string | ArrayBuffer;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImage = null;
  }

  submitReport(subject: string, details: string) {
    // In a real app, you would save this data to a backend.
    this.detailModalData = {
      room: 'ห้อง 509 แจ้งซ่อม', // Mock data
      subject: subject || 'แอร์เสีย',
      details: details || '',
      image: this.selectedImage,
      status: 'รอการยืนยัน',
      date: '19 มกราคม 2025 17:43',
      reportedBy: {
        name: 'นาย ก.',
        room: 'ผู้เช่าห้อง 509'
      }
    };
    this.closeAddReportModal();
    this.isDetailModalOpen = true;
  }

  closeDetailModal() {
    this.isDetailModalOpen = false;
    this.detailModalData = null;
    this.isEditMode = false;
  }

  editReport() {
    this.isEditMode = true;
  }

  saveEdit() {
    // In a real app, save changes to backend here
    // For now, update the mock list if it's the first item
    if (this.reports.length > 0) {
      this.reports[0].title = this.detailModalData.subject;
      // You could update other fields here as well
    }

    this.closeDetailModal();
  }

  cancelEdit() {
    // Revert changes or simply close edit mode
    this.isEditMode = false;
  }
}
