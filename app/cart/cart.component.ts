import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { CNavComponent } from '../c-nav/c-nav.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  imports: [CommonModule, FormsModule,FooterComponent, CNavComponent],
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  constructor(private router: Router, private http: HttpClient) {}

  cartItems: any[] = [];
  totalAmount = 0;
  emailId = '';
  orderPlaced = false;
  orderSummary: any = { orderId: 0, customerId: 0, restaurantId: 0, status: 'PENDING', totalAmount: 0, menuItems: [] };

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.emailId = localStorage.getItem("userEmail") || '';
    if (this.emailId) {
      this.cartItems = JSON.parse(localStorage.getItem(`cart_${this.emailId}`) || "[]");
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  incrementQuantity(index: number): void { 
    this.cartItems[index].quantity++; 
    this.updateLocalStorage(); 
  }

  decrementQuantity(index: number): void { 
    if (this.cartItems[index].quantity > 1) { 
      this.cartItems[index].quantity--; 
      this.updateLocalStorage(); 
    } 
  }

  removeFromCart(index: number): void { 
    this.cartItems.splice(index, 1); 
    this.updateLocalStorage(); 
  } 

  updateLocalStorage(): void {
    if (this.emailId) {
      localStorage.setItem(`cart_${this.emailId}`, JSON.stringify(this.cartItems));
     
    }
  } 

  getCustomerIdByEmail(email: string): Promise<number | null> {
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

      this.http.get(`http://localhost:9090/customers/getCustomerByEmail?email=${encodeURIComponent(email)}`, { headers })
        .subscribe({
          next: (response: any) => {
            console.log("✅ Raw Backend Response:", response);
            console.log("✅ Extracted customerId:", response?.customerId);
            resolve(response?.customerId || null);
          },
          error: (err) => {
            console.error("❌ Error fetching customer ID:", err);
            reject(null);
          }
        });
    });
  }

  async placeOrder() {
    if (this.cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    try {
      const customerId = await this.getCustomerIdByEmail(this.emailId);

      if (!customerId) {
          alert("Failed to retrieve customer ID. Please log in again.");
          return;
      }

      this.orderSummary = {
          customerId: customerId,
          restaurantId: this.cartItems[0].restaurantId,
          status: 'PENDING',
          totalAmount: this.totalAmount,
          menuItems: [...this.cartItems]
      };
      // Retrieve existing orders from local storage
    let existingOrders = JSON.parse(localStorage.getItem(`orders_${this.emailId}`) || '[]');
   
    // Add new order to orders list
    existingOrders.push(this.orderSummary);
 
    // Save updated orders back to local storage
    localStorage.setItem(`orders_${this.emailId}`, JSON.stringify(existingOrders));
 

      console.log("✅ Final Order Summary:", this.orderSummary);

      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.http.post('http://localhost:9090/orders/create/order', this.orderSummary, { headers })
        .subscribe({
          next: (response) => {
            console.log("✅ Order placed successfully:", response);
            alert("Order placed successfully!");
            localStorage.removeItem(`cart_${this.emailId}`);
            this.cartItems = [];
            this.orderPlaced = true;
          },
          error: (error) => {
            console.error("❌ Error placing order:", error);
            alert("Failed to place order. Please try again.");
          }
        });
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      alert("Unexpected error occurred. Please try again.");
    }
  }
}
