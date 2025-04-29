import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthApiService } from '../services/authapi.service';

@Component({
  selector: 'app-a-nav',
  imports: [RouterLink],
  templateUrl: './a-nav.component.html',
  styleUrl: './a-nav.component.css'
})
export class ANavComponent {

  constructor(private authService: AuthApiService) {}
  
    logOutUser() {
      console.log("🚪 Logging out user...");
      this.authService.logOutUser(); // Call the logout method in AuthApiService
    }
}
