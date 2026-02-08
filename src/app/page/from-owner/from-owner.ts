import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-from-owner',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './from-owner.html',
  styleUrl: './from-owner.scss',
})
export class FromOwner {
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.router.navigate(['/login']);
  }
}
