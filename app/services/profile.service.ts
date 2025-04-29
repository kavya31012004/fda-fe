import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileBaseUrl = 'http://localhost:9090/customers';

  constructor(private http: HttpClient) {}

  // ✅ Fetch user profile by email
  getCustomerByEmail(email: string): Observable<any> {
    return this.http.get(`${this.profileBaseUrl}/getCustomerByEmail?email=${encodeURIComponent(email)}`);
  }

  // ✅ Update user profile
  updateUserProfile(data: any): Observable<any> {
    return this.http.put(`${this.profileBaseUrl}/update`, data);
  }
}
