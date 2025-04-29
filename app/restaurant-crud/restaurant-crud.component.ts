import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RestaurantCRUDService } from '../services/restaurant-crud.service';
import { ANavComponent } from '../a-nav/a-nav.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-restaurant-crud',
  standalone: true,
  imports: [FormsModule, CommonModule,ANavComponent,FooterComponent],
  templateUrl: './restaurant-crud.component.html',
  styleUrl: './restaurant-crud.component.css',
})
export class RestaurantCRUDComponent {
  restaurantsLoaded: boolean=false;
  restaurants: any[]=[];
  constructor(
    private adminRestaurantService: RestaurantCRUDService,
    private route: ActivatedRoute
  ) {}

  // Component attributes
  actionType: string = ''; // Tracks current action ('create', 'update', 'delete')
  restaurantId: number = 0; // Changed from string to number
  name: string = '';
  location: string = '';
  cuisineType: string = '';
  imageUrl: string = '';
  rating: number | null = null;

  message: string = '';

  ngOnInit(): void {
    this.getAll(); // Fetch restaurants by default on page load
  
    // Retrieve actionType from route parameters or set default value
    this.actionType = this.route.snapshot.paramMap.get('actionType') || 'create';
  
    // Convert route param from string to number (for updates)
    const restaurantIdParam = this.route.snapshot.paramMap.get('restaurantId');
    if (restaurantIdParam && this.actionType === 'update') {
      this.restaurantId = Number(restaurantIdParam);
      this.fetchRestaurantById(this.restaurantId);
    }
  }
  

  setAction(action: string): void {
    this.actionType = action;
    this.resetForm();
  }

  resetForm(): void {
    this.restaurantId = 0;
    this.name = '';
    this.location = '';
    this.cuisineType = '';
    this.imageUrl = '';
    this.rating = null;
  }

  fetchRestaurantById(restaurantId: number): void {
    this.adminRestaurantService.getRestaurantById(restaurantId).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          const restaurant = res.restaurant;
          this.restaurantId = restaurant.restaurantId;
          this.name = restaurant.name;
          this.location = restaurant.location;
          this.cuisineType = restaurant.cuisineType;
          this.imageUrl = restaurant.imageUrl;
          this.rating = restaurant.rating;
        } else {
          this.showMessage(res.message);
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || 'Unable to fetch restaurant');
        console.error("Fetch restaurant error:", error);
      },
    });
  }

  getAll(): void {
    this.adminRestaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        console.log('Restaurants:', data); // Verify data is received
        this.restaurants = data;
        this.restaurantsLoaded = true;
        this.actionType = 'getAll'; // Set action type to display the restaurants
      },
      error: (error) => {
        console.error('Error fetching restaurants:', error);
      }
    });
  }
  



  handleSubmit(event: Event): void {
    event.preventDefault();

    if (this.actionType === 'create') {
      this.createRestaurant();
    } else if (this.actionType === 'update') {
      this.updateRestaurant();
    } else if (this.actionType === 'delete') {
      this.deleteRestaurant();
    }
    else if (this.actionType === 'getAll') {
      this.getAll();
    }
  }

  createRestaurant(): void {
    const restaurantData = {
      name: this.name,
      location: this.location,
      cuisineType: this.cuisineType,
      imageUrl: this.imageUrl,
      rating: this.rating,
    };

    this.adminRestaurantService.createRestaurant(restaurantData).subscribe({
      next: () => this.showMessage('Restaurant created successfully'),
      error: (error) => {
        this.showMessage(error?.error?.message || 'Unable to create restaurant');
        console.error("Create restaurant error:", error);
      },
    });
  }

  updateRestaurant(): void {
    if (this.restaurantId <= 0) {
      this.showMessage('Invalid Restaurant ID for update.');
      return;
    }
  
    const restaurantData = {
      restaurantId: this.restaurantId, // Ensure the ID is passed for backend identification
      name: this.name,
      location: this.location,
      cuisineType: this.cuisineType,
      imageUrl: this.imageUrl,
      rating: this.rating,
    };
  
    this.adminRestaurantService.updateRestaurant(this.restaurantId, restaurantData).subscribe({
      next: () => this.showMessage('Restaurant updated successfully'),
      error: (error) => {
        this.showMessage(error?.error?.message || 'Unable to update restaurant');
        console.error("Update restaurant error:", error);
      },
    });
  }
  

  deleteRestaurant(): void {
    if (this.restaurantId <= 0) {
      this.showMessage('Invalid Restaurant ID for deletion.');
      return;
    }
  
    this.adminRestaurantService.deleteRestaurant(this.restaurantId).subscribe({
      next: (response) => {
        console.log("Success response:", response); // Log the raw response
        this.showMessage(response?.message || 'Restaurant deleted successfully'); // ✅ Ensure correct parsing
      },
      error: (error) => {
        console.error("Delete restaurant error:", error);
        this.showMessage(error?.error?.message || 'Restaurant not found or unable to delete.');
      },
    });
  }
  
  
  

  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}
