import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthApiService } from './services/authapi.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'fda';
  authService = inject(AuthApiService);
  router = inject(Router); // Inject Router directly

  async ngOnInit() {
    console.log("🚀 Checking authentication status...");
    const isLoggedIn = this.authService.isAuthenticated();

    if (!isLoggedIn) {
        console.warn("❌ User is not authenticated. Redirecting to login.");
        this.router.navigate(['/home']);
        this.authService.logOutUser();
        return;
    }

    console.log("✅ User is authenticated.");

    try {
        // Retrieve email from token
        const email = this.authService.getEmailFromToken();
        if (!email) {
            console.warn("❌ No email found in token. Staying on the current page.");
            return;
        }

        // Retrieve user role from database
        const roleResponse = await this.authService.getRoleFromDatabase(email);
        const role = JSON.parse(roleResponse).role; // Assuming the response is a JSON string

        console.log("🔍 Retrieved Role from Database:", role);

        // Navigate based on role using injected Router
        if (role === 'ADMIN') {
            this.router.navigate(['/restaurant-crud']);
        } else if (role === 'USER') {
            this.router.navigate(['/restaurants']);
        } else if (role === 'AGENT') {
            this.router.navigate(['/create-delivery']);
        } else {
            console.warn("❌ Unknown role detected, staying on the current page.");
        }
    } catch (error) {
        console.error("⚠️ Error retrieving role from database:", error);
    }
  }
}
