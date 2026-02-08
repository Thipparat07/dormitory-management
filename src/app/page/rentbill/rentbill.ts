import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rentbill',
  imports: [CommonModule],
  templateUrl: './rentbill.html',
  styleUrl: './rentbill.scss',
})
export class Rentbill {
  isMenuOpen: boolean = false;

  bills = [
    {
      title: 'บิลค่าเช่า เดือน มกราคม/2025',
      status: 'pending',
      statusText: 'รอตรวจสอบการชำระเงิน',
      items: [
        { name: 'ค่าเช่าห้อง (Room rate) 509 เดือน 1/2025', amount: '4,500' },
        { name: 'ค่าน้ำ (Water rate) เดือน 1/2025', amount: '150' },
        { name: 'ค่าไฟฟ้า (Electrical rate) เดือน 1/2025', amount: '850' }
      ],
      total: '5,500'
    },
    {
      title: 'บิลค่าเช่า เดือน ธันวาคม/2025',
      status: 'pending',
      statusText: 'รอตรวจสอบการชำระเงิน',
      items: [
        { name: 'ค่าเช่าห้อง (Room rate) 509 เดือน 12/2025', amount: '4,500' },
        { name: 'ค่าน้ำ (Water rate) เดือน 12/2025', amount: '120' },
        { name: 'ค่าไฟฟ้า (Electrical rate) เดือน 12/2025', amount: '700' }
      ],
      total: '5,320'
    },
    {
      title: 'บิลค่าเช่า เดือน กุมภาพันธ์/2025',
      status: 'overdue',
      statusText: 'ค้างชำระ',
      items: [
        { name: 'ค่าเช่าห้อง (Room rate) 509 เดือน 2/2025', amount: '4,500' },
        { name: 'ค่าน้ำ (Water rate) เดือน 2/2025', amount: '160' },
        { name: 'ค่าไฟฟ้า (Electrical rate) เดือน 2/2025', amount: '900' }
      ],
      total: '5,560'
    },
    {
      title: 'บิลค่าเช่า เดือน ตุลาคม/2025',
      status: 'overdue',
      statusText: 'ค้างชำระ',
      items: [
        { name: 'ค่าเช่าห้อง (Room rate) 509 เดือน 10/2025', amount: '4,500' },
        { name: 'ค่าน้ำ (Water rate) เดือน 10/2025', amount: '140' },
        { name: 'ค่าไฟฟ้า (Electrical rate) เดือน 10/2025', amount: '800' }
      ],
      total: '5,440'
    },
    {
      title: 'บิลค่าเช่า เดือน เมษายน/2024',
      status: 'paid',
      statusText: 'ชำระเงินแล้ว',
      items: [],
      total: '0'
    },
    {
      title: 'บิลค่าเช่า เดือน สิงหาคม/2024',
      status: 'paid',
      statusText: 'ชำระเงินแล้ว',
      items: [],
      total: '0'
    },
    {
      title: 'บิลค่าเช่า เดือน พฤษภาคม/2023',
      status: 'paid',
      statusText: 'ชำระเงินแล้ว',
      items: [],
      total: '0'
    },
    {
      title: 'บิลค่าเช่า เดือน มีนาคม/2023',
      status: 'paid',
      statusText: 'ชำระเงินแล้ว',
      items: [],
      total: '0'
    },
  ];

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  selectBill(bill: any) {
    console.log('Selected bill:', bill);
    this.router.navigate(['/bill-details'], { state: { bill: bill } });
  }
}
