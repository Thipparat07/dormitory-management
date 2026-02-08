import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-owner-addbank',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './owner-addbank.html',
  styleUrl: './owner-addbank.scss',
})
export class OwnerAddbank {
  isMenuOpen = false;
  isSettingsMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.isSettingsMenuOpen = false; // Close other menu
  }

  toggleSettingsMenu() {
    this.isSettingsMenuOpen = !this.isSettingsMenuOpen;
    this.isMenuOpen = false; // Close other menu
  }

  logout() {
    this.router.navigate(['/login']);
  }

  // Add Bank Modal Logic
  isAddBankModalOpen = false;

  openAddBankModal() {
    this.isAddBankModalOpen = true;
  }

  closeAddBankModal() {
    this.isAddBankModalOpen = false;
  }

  // Edit Bank Modal Logic
  isEditBankModalOpen = false;

  openEditBankModal() {
    this.isEditBankModalOpen = true;
  }

  closeEditBankModal() {
    this.isEditBankModalOpen = false;
  }
}
