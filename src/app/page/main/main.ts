import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngIf
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-main',
  imports: [CommonModule], // Add CommonModule to imports
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    // Perform logout logic here (e.g., clear tokens)
    this.router.navigate(['/login']);
  }
}
