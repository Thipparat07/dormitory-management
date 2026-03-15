import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-invoice-details',
  imports: [CommonModule],
  templateUrl: './invoice-details.html',
  styleUrl: './invoice-details.scss',
})
export class InvoiceDetails {
  bill: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.bill = history.state.bill;
    console.log('Bill Details:', this.bill);
  }

  close() {
    this.router.navigate(['/tenant/billing']);
  }

  goToOverduePayment() {
    this.router.navigate(['/tenant/overdue'], { state: { bill: this.bill } });
  }
}
