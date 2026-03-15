import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-overdue-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overdue-payment.html',
  styleUrl: './overdue-payment.scss',
})
export class OverduePayment implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  bill: any;
  roomId: string | null = null;
  private querySub: Subscription | null = null;

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state?.['bill']) {
      this.bill = navigation.extras.state['bill'];
    } else {
      this.bill = history.state.bill;
    }
    console.log('Overdue Bill:', this.bill);
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

  close() {
    this.router.navigate(['/tenant/billing'], { 
      queryParams: { room_id: this.roomId } 
    });
  }

  selectAccount() {
    this.router.navigate(['/tenant/upload-slip'], { 
      state: { bill: this.bill },
      queryParams: { room_id: this.roomId }
    });
  }
}
