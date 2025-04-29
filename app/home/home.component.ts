import { Component, inject, OnInit, signal } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastManagerService } from '../services/toastr.service';
import { AuthApiService } from '../services/authapi.service';
import { RestaurantListComponent } from '../restaurant-list/restaurant-list.component';
import { AdminRestaurantComponent } from '../admin-restaurant/admin-restaurant.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FooterComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  authService = inject(AuthApiService);
  user = signal<any>(null);

  toastManagerService = inject(ToastManagerService);

  ngOnInit(){
    this.authService.user$.subscribe((user) => {
      this.user.set(user);
    });
  }

  title = 'Craving? We\'ve Got You Covered!';
  description = 'Order your favorite meals from top restaurants near you.';
}
