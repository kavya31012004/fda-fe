import { inject, Injectable } from "@angular/core";
//import { LogInData } from "../app/models/LogInData";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, firstValueFrom } from "rxjs";
//import { RegisterData } from "../app/models/RegisterData";

@Injectable({providedIn: 'root'})
export class AuthApiService{
    private httpClient: HttpClient = inject(HttpClient);
    private baseUrl = "http://localhost:9090/auth"
    private route = inject(Router);
    private userSubject = new BehaviorSubject<any>(null);
    user$ =  this.userSubject.asObservable();
    role : string = '';
    email : string ='';

    constructor(){
        console.log("🚀 Checking for existing JWT...");
        this.getUserDetails(); // Ensure user details are fetched when app loads
    }
    
    // To show the loading spinner, while waiting for the API response, made it async/await
    async logInUser(data: any){//LogInData
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const response =  this.httpClient.post<{email: string, userId: string, jwtToken: string}>(this.baseUrl + '/login', data, {headers});

        return firstValueFrom(response);
    }

     // To show the loading spinner, while waiting for the API response, made it async/await
    registerUser(data: any){//RegisterData){
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const response = this.httpClient.post<any>(this.baseUrl + '/register', data, {headers})

        return firstValueFrom(response);
    }

    async handleLogIn(jwtToken: string): Promise<void> {
        this.saveJwtToken(jwtToken); 
        this.getUserDetails(); 
    
        const email = this.getEmailFromToken();
        if (!email) {
            console.warn("❌ Email not found in token.");
            return;
        }
    
        localStorage.setItem("userEmail", email);
        try {
            const role = await this.getRoleFromDatabase(email);
            const parsedRole = JSON.parse(role).role;
    
            console.log(`Parsed Role: "${parsedRole}"`);
    
            if (parsedRole === 'ADMIN') {
                console.log("🚀 Navigating to ADMIN dashboard...");
                this.route.navigate(['/restaurant-crud'], { replaceUrl: true });
            } else if (parsedRole === 'USER') {
                this.route.navigate(['/restaurants'], { replaceUrl: true });
            } else if (parsedRole === 'AGENT') {
                this.route.navigate(['/create-delivery'], { replaceUrl: true });
            } else {
                console.warn(`Unknown role detected: "${parsedRole}". No redirection performed.`);
            }
        } catch (error) {
            console.error("❌ Error fetching role:", error);
        }
    }
    
    
    
    async getRoleFromDatabase(email: string): Promise<string> {
        
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
       
            const response = await firstValueFrom(
                this.httpClient.get(`http://localhost:9090/customers/getRoleByEmail?email=${encodeURIComponent(email)}`, {
                    headers,
                    responseType: 'text'
                })
            );
            return response ; // Handle empty response
        
    }
    
    
    


    getUserDetails() {
        const token = this.getToken();
        if (!token) {
            console.warn("❌ No token found on refresh.");
            return;
        }
    
        const payload = this.decodeJwt(token);
        if (!payload) {
            console.warn("❌ Failed to extract user details from token.");
            return;
        }
    
        console.log("✅ Extracted User Details from Token:", payload);
    
        this.userSubject.next(payload);
        this.email = payload.sub;
        localStorage.setItem("userEmail", this.email);
    
        if (payload.customerId) {
            localStorage.setItem("customerId", String(payload.customerId)); // ✅ Store customerId from token
            console.log("✅ Stored customerId in localStorage:", localStorage.getItem("customerId"));
        } else {
            console.warn("❌ No customerId found in token.");
        }
    }
    
    getUserById(id: string){
        const token = this.getToken();
        if(!token){
            this.route.navigate(["/home"]);
            return;
        }

        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

        return this.httpClient.get(`${this.baseUrl}/${id}`, {headers});
    }
    saveJwtToken(token: string){
        localStorage.setItem('foodDeliveryApp$', token);
        console.log("✅ Stored JWT in localStorage:", localStorage.getItem('foodDeliveryApp$'));
    }
    

    getEmailFromToken(): string | null{
        const token = this.getToken();
        if(token != null){
           const payload = JSON.parse(atob(token.split(".")[1]));
           console.log("Inside service: " + payload)
           return payload.sub;
        }else{
            return null;
        }
    }

    getRoleFromToken(): string | null {
        const token = this.getToken();
        if (token != null) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1])); // Decode the JWT payload
                console.log("Decoded JWT payload:", payload); // Debug log
                return payload.role || null; // Return the role
            } catch (error) {
                console.error("Error decoding token:", error);
                return null; // Return null if decoding fails
            }
        } else {
            console.warn("No token found.");
            return null;
        }
    }
    
    

    removeJwtToken(){
        localStorage.removeItem('foodDeliveryApp$');
    }

    getToken(){
        return localStorage.getItem('foodDeliveryApp$');
    }
    logOutUser() {
        console.log("🚪 Logging out user and clearing credentials...");
        
        localStorage.removeItem("userEmail"); // ✅ Remove stored email only
        this.removeJwtToken(); // ✅ Remove the JWT
        this.userSubject.next(null);
        this.userSubject.complete(); // ✅ Marks observable as completed
    
        console.log("✅ Email removed, user logged out.");
        
        // ✅ Explicitly Check Authentication Status After Logout
        setTimeout(() => {
            if (!this.isAuthenticated()) {
                this.route.navigate(["/home"], { replaceUrl: true })
            }
        }, 100); // Short delay ensures localStorage changes are fully applied
    }
    
    
    

    decodeJwt(token: string): any {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload; // Returns extracted user details
        } catch (error) {
            console.error("❌ Error decoding JWT:", error);
            return null;
        }
    }
    
    

    isAuthenticated(){
        return !!this.getToken();
    }

}