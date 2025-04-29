import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthApiService } from '../services/authapi.service';
import { ToastManagerService } from '../services/toastr.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  authService = inject(AuthApiService);
  user = signal<any>(null);
  toastManagerService = inject(ToastManagerService);
  router = inject(Router);

  ngOnInit() {
    this.authService.user$.subscribe((user) => {
      this.user.set(user);
    });
  }

  logout(): void {
    const userEmail = localStorage.getItem("userEmail");

    if (userEmail) {
      localStorage.removeItem(`cart_${userEmail}`); // Remove cart items
    }

    localStorage.removeItem("userEmail"); // Remove user session

    this.authService.logOutUser(); // Call logout method in AuthApiService
    this.router.navigate(['/login']); // Redirect to login page
  }
}
