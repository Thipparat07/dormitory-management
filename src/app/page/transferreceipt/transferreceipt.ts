import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transferreceipt',
  imports: [CommonModule],
  templateUrl: './transferreceipt.html',
  styleUrl: './transferreceipt.scss',
})
export class Transferreceipt {
  bill: any;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.bill = history.state.bill;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLElement;
    fileInput.click();
  }

  close() {
    this.router.navigate(['/rentbill']);
  }

  goBack() {
    window.history.back();
  }
}
