import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthApiService } from '../services/authapi.service';

@Component({
  selector: 'app-c-nav',
  imports: [RouterLink],
  templateUrl: './c-nav.component.html',
  styleUrl: './c-nav.component.css'
})
export class CNavComponent {
  constructor(private authService: AuthApiService) {}

  logOutUser() {
    console.log("🚪 Logging out user...");
    this.authService.logOutUser(); // Call the logout method in AuthApiService
  }
}