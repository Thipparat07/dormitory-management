import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload-slip',
  imports: [CommonModule],
  templateUrl: './upload-slip.html',
  styleUrl: './upload-slip.scss',
})
export class UploadSlip {
  bill: any;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['bill']) {
      this.bill = navigation.extras.state['bill'];
    } else {
      this.bill = history.state.bill;
    }
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
    this.router.navigate(['/tenant/billing']);
  }

  goBack() {
    window.history.back();
  }
}
