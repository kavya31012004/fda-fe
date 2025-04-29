import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RestaurantCRUDService {
  private restaurantBaseUrl = 'http://localhost:9090/restaurants'; // Adjust URL as needed

  constructor(private http: HttpClient) {}

  // Create a restaurant
  createRestaurant(data: any): Observable<any> {
    return this.http.post(`${this.restaurantBaseUrl}/createRestaurant`, data);
  }

  getAllRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.restaurantBaseUrl}/getAllRestaurants`);
  }
  

  // Get a restaurant by ID
  getRestaurantById(restaurantId: number): Observable<any> {
    return this.http.get(`${this.restaurantBaseUrl}/getRestaurantById/${restaurantId}`);
  }



  // Update restaurant

updateRestaurant(restaurantId: number, data: any): Observable<any> {
  return this.http.put(`${this.restaurantBaseUrl}/updateRestaurant/${restaurantId}`, data);
}

  

  // Delete restaurant
  deleteRestaurant(restaurantId: number): Observable<any> {
    return this.http.delete(`${this.restaurantBaseUrl}/deleteRestaurant/${restaurantId}`);
  }
}
