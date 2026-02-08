import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-overdue-payment',
  imports: [CommonModule],
  templateUrl: './overdue-payment.html',
  styleUrl: './overdue-payment.scss',
})
export class OverduePayment {

  bill: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.bill = history.state.bill;
    console.log('Overdue Bill:', this.bill);
  }

  close() {
    this.router.navigate(['/rentbill']);
  }

  selectAccount() {
    this.router.navigate(['/transferreceipt'], { state: { bill: this.bill } });
  }
}
