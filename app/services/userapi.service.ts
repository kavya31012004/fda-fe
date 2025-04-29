import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { AuthApiService } from "./authapi.service";

@Injectable({providedIn: 'root'})
export class UserApiService{
    
    private BASE_URL = "http://localhost:9090/customers"
    private httpClient = inject(HttpClient);
    private authService = inject(AuthApiService);
    private jwtToken = this.authService.getToken()
    private authHeader = new HttpHeaders({ 'Authorization': `Bearer ${this.jwtToken}` });

    editUserProfile(data: any){//UserData){
        return this.httpClient.put<any>(
            `${this.BASE_URL}`,
            data,
            {
                headers: this.authHeader
            }
        )
    }
    changeUserPassword(data: any){
        return this.httpClient.put<any>(
            `${this.BASE_URL}/change-password`,
            data,
            {
                headers: this.authHeader
            }
        )
    }
    

    deleteUserById(id: string){
        return this.httpClient.delete<any>(
            `${this.BASE_URL}/${id}`,
            {
                headers: this.authHeader
            }
        )
    }
}