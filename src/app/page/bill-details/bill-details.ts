import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bill-details',
  imports: [CommonModule],
  templateUrl: './bill-details.html',
  styleUrl: './bill-details.scss',
})
export class BillDetails {
  bill: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.bill = history.state.bill;
    console.log('Bill Details:', this.bill);
  }

  close() {
    this.router.navigate(['/rentbill']);
  }

  goToOverduePayment() {
    this.router.navigate(['/overdue-payment'], { state: { bill: this.bill } });
  }
}
