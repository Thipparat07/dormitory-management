import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-details.html',
  styleUrl: './invoice-details.scss',
})
export class InvoiceDetails implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  bill: any;
  roomId: string | null = null;
  private querySub: Subscription | null = null;

  constructor() {
    this.bill = history.state.bill;
    console.log('Bill initialized from history state:', this.bill);
  }

  ngOnInit() {
    this.querySub = this.route.queryParams.subscribe(params => {
      this.roomId = params['room_id'] || null;
      console.log('Room ID captured from queryParams:', this.roomId);
    });
  }

  ngOnDestroy() {
    if (this.querySub) {
      this.querySub.unsubscribe();
    }
  }

  close() {
    console.log('Closing invoice, returning to billing with roomId:', this.roomId);
    this.router.navigate(['/tenant/billing'], { 
      queryParams: { room_id: this.roomId } 
    });
  }

  goToOverduePayment() {
    this.router.navigate(['/tenant/overdue'], { 
      state: { bill: this.bill },
      queryParams: { room_id: this.roomId }
    });
  }
}
