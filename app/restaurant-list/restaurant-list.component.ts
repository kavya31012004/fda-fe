import { Component, OnInit } from '@angular/core';
import { RestaurantService } from '../services/restaurant.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CNavComponent } from '../c-nav/c-nav.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-restaurant-list',
  imports: [RouterLink,CommonModule,FormsModule,CNavComponent,FooterComponent],
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.css'],
  providers : [RestaurantService]
})
export class RestaurantListComponent implements OnInit {
  restaurants: any[] = [];
  filteredRestaurants: any[] = [];
  searchQuery: string = '';
  selectedCuisine: string = '';
  noResultsMessage : string = '';

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.fetchRestaurants();
  }

  fetchRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (data) => {
        this.restaurants = data;
        this.filteredRestaurants = data; // Initialize filtered restaurants
      },
      error: (error) => {
        console.error('Error fetching restaurants:', error);
      },
    });
  }

  filterByCuisine(): void {
    if (this.selectedCuisine) {
      this.restaurantService.getRestaurantsByCuisineType(this.selectedCuisine).subscribe({
        next: (data) => {
          if (data && data.length === 0) { // Ensure the returned data exists and is empty
            this.filteredRestaurants = [];
            this.noResultsMessage = `Sorry, no restaurants found for cuisine type "${this.selectedCuisine}".`;
          } else {
            this.filteredRestaurants = data || []; // Ensure filteredRestaurants is always an array
            this.noResultsMessage = ''; // Clear the message
          }
        },
        error: (error) => {
          //console.error('Error filtering by cuisine:', error);
          this.filteredRestaurants = []; // Ensure filteredRestaurants is reset
          this.noResultsMessage = `Sorry, no restaurants found for cuisine type "${this.selectedCuisine}".`;
        },
      });
    } else {
      this.filteredRestaurants = this.restaurants; // Reset to all restaurants
      this.noResultsMessage = ''; // Clear the message
    }
  }
  
  filterByRating(event: Event): void {
    const target = event.target as HTMLSelectElement; // Type assertion
    const rating = Number(target.value); // Convert the value to a number
    if (rating) {
      this.filteredRestaurants = this.restaurants.filter(restaurant => restaurant.rating >= rating);
      if (this.filteredRestaurants.length === 0) {
        this.noResultsMessage = `Sorry, no restaurants found with a rating of ${rating} or higher.`;
      } else {
        this.noResultsMessage = ''; // Clear message if restaurants exist
      }
    } else {
      this.filteredRestaurants = this.restaurants; // Reset to all restaurants
      this.noResultsMessage = ''; // Clear the message
    }
  }
  
  
  
  searchByName(): void {
    if (this.searchQuery) {
      this.restaurantService.getRestaurantsByName(this.searchQuery).subscribe({
        next: (data) => {
          // Check if the response is an array or a single object
          this.filteredRestaurants = Array.isArray(data) ? data : [data]; 
  
          // Handle cases with no results
          if (this.filteredRestaurants.length === 0) {
            this.noResultsMessage = `Sorry, no restaurants found with the name "${this.searchQuery}".`;
          } else {
            this.noResultsMessage = ''; // Clear message if results exist
          }
        },
        error: (error) => {
          console.error('Error searching by name:', error);
  
          // Handle API errors
          this.filteredRestaurants = [];
          this.noResultsMessage = `Sorry, no restaurants found with the name "${this.searchQuery}".`;
        },
      });
    } else {
      // Reset filtered restaurants if the search query is empty
      this.filteredRestaurants = this.restaurants;
      this.noResultsMessage = ''; // Clear the message
    }
  }
  
  
}
