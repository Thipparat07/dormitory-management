import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dormdata',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dormdata.html',
  styleUrl: './dormdata.scss',
})
export class Dormdata {
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    // Add any logout logic here (e.g., clearing tokens)
    this.router.navigate(['/login']);
  }
}
