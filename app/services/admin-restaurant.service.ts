import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminRestaurantService {
  private baseUrl = 'http://localhost:9090/menu'; // Base API URL

  constructor(private http: HttpClient) {}

  getAllItems(restaurantId: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${restaurantId}`);
  }
  

  // Add a new menu item (POST)
  addMenuItem(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, data);
  }

  // Update an existing menu item (PUT with restaurantId and menu name in URL)
  updateMenuItem(restaurantId: string, menuName: string, data: FormData): Observable<any> {
    console.log('Entered');
    return this.http.put(`${this.baseUrl}/${restaurantId}/${menuName}`, data);
  }

  // Get a menu item by ID (GET)
  getMenuById(menuId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${menuId}`);
  }

  // Delete a menu item by restaurant ID and menu name (DELETE)
  deleteMenuItem(restaurantId: string, menuName: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${restaurantId}/${menuName}`);
  }
}
