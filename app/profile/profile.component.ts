import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../services/profile.service';
import { FooterComponent } from '../footer/footer.component';
import { CNavComponent } from '../c-nav/c-nav.component';
import { ANavComponent } from '../a-nav/a-nav.component';
import { AgNavComponent } from '../ag-nav/ag-nav.component';
import { ChangepasswordComponent } from '../changepassword/changepassword.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule,FooterComponent,CNavComponent,ANavComponent,AgNavComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(private profileService: ProfileService,private router:Router) {}

  user: any = {}; // Stores user details
  isEditing: boolean = false;
  message: string = '';

  ngOnInit(): void {
    this.fetchUserProfile();
  }
  changePassword() {
    this.router.navigate(['/change-password']);
  }

  fetchUserProfile(): void {
    console.log("Local Storage Contents:", localStorage); // ✅ Debugging log

    const email = localStorage.getItem('userEmail'); // ✅ Correct key name
    console.log("Retrieved email in Profile:", email); // ✅ Debugging log

    if (!email || email === "null") { // ✅ Additional check for "null"
        this.showMessage('User email not found in local storage');
        return;
    }

    this.profileService.getCustomerByEmail(email).subscribe({
        next: (res: any) => {
            console.log('Fetched user data:', res);
            if (res) {
                this.user = res;
            } else {
                this.showMessage('No user data found');
            }
        },
        error: (error: any) => {
            console.error("Error fetching user profile:", error); // ✅ Improved logging
            this.showMessage(error?.error?.message || 'Unable to fetch user details');
        },
    });
  }

  enableEditing(): void {
    this.isEditing = true;
  }

  saveProfile(): void {
    // ✅ Exclude password field from update request to prevent validation issues
    const updatedProfileData = {
      customerId: this.user.customerId, // Ensure ID is passed correctly
      role: this.user.role, // Preserve user role
      name: this.user.name,
      email: this.user.email,
      phone: this.user.phone,
      address: this.user.address,
      password: this.user.password
      // ❌ Don't include password field
    };
  
    this.profileService.updateUserProfile(updatedProfileData).subscribe({
      next: () => {
        this.isEditing = false;
        this.showMessage('Profile updated successfully');
      },
      error: (error: any) => {
        console.error("Error updating profile:", error); // ✅ Debugging log
        this.showMessage(error?.error?.message || 'Unable to update profile');
      },
    });
  }
  

  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
