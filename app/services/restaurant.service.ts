import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RestaurantService {
  private baseUrl = 'http://localhost:9090/restaurants';

  constructor(private http: HttpClient) {}

  getAllRestaurants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getAllRestaurants`);
  }

  getRestaurantsByCuisineType(cuisineType: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getRestaurantByCuisineType/${cuisineType}`);
  }

  getRestaurantsByName(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/getRestaurantByName/${name}`);
  }
}
