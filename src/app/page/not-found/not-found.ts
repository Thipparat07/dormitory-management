import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './not-found.html',
    styleUrl: './not-found.scss',
})
export class NotFound {
    private router = inject(Router);

    goBack() {
        // If there's history, go back; otherwise go to root
        if (window.history.length > 1) {
            window.history.back();
        } else {
            this.router.navigate(['/']);
        }
    }
}
