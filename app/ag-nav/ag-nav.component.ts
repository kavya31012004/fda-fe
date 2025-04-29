import { Component } from '@angular/core';
import { AuthApiService } from '../services/authapi.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ag-nav',
  imports: [RouterLink],
  templateUrl: './ag-nav.component.html',
  styleUrl: './ag-nav.component.css'
})
export class AgNavComponent {
 constructor(private authService: AuthApiService) {}
  
    logOutUser() {
      console.log("🚪 Logging out user...");
      this.authService.logOutUser(); // Call the logout method in AuthApiService
    }
}
