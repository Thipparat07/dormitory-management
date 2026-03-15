import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-slip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-slip.html',
  styleUrl: './upload-slip.scss',
})
export class UploadSlip implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  bill: any;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  roomId: string | null = null;
  private querySub: Subscription | null = null;

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['bill']) {
      this.bill = navigation.extras.state['bill'];
    } else {
      this.bill = history.state.bill;
    }
  }

  ngOnInit() {
    this.querySub = this.route.queryParams.subscribe(params => {
      this.roomId = params['room_id'] || null;
    });
  }

  ngOnDestroy() {
    if (this.querySub) {
      this.querySub.unsubscribe();
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
    this.router.navigate(['/tenant/billing'], { 
      queryParams: { room_id: this.roomId } 
    });
  }

  goBack() {
    this.router.navigate(['/tenant/overdue'], { 
      state: { bill: this.bill },
      queryParams: { room_id: this.roomId }
    });
  }
}
