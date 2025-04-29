import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { FooterComponent } from '../footer/footer.component';
import { CNavComponent } from '../c-nav/c-nav.component';

@Component({
  selector: 'app-menu',
  imports: [CommonModule,FormsModule,FooterComponent,CNavComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
  restaurantId: string = '';
  restaurantName : string = '';
  menuData: any = [];
  cart: any[] = [];
  constructor(private route: ActivatedRoute, private http: HttpClient,private router : Router, private cartService : CartService) {}

  ngOnInit(): void {
    // Get restaurant ID from URL
    this.restaurantId = this.route.snapshot.paramMap.get('id') || '';
    
    // Fetch menu data from API
    this.http.get(`http://localhost:9090/menu/${this.restaurantId}`).subscribe({
      next: (data) => {
        this.menuData = data; // Store menu data
      },
      error: (error) => {
        console.error('Error fetching menu data:', error);
      }
    });
  }
  

  redirectToCart(item: any): void {
    // Get user email from localStorage
    const userEmail = localStorage.getItem("userEmail");
  
    if (!userEmail) {
      alert("User not logged in! Please log in to add items.");
      return;
    }
  
    // Retrieve existing cart for this user
    let cart = JSON.parse(localStorage.getItem(`cart_${userEmail}`) || "[]");
  
    // Check if the item already exists in the cart
    const existingItem = cart.find((cartItem: any) => cartItem.name === item.name);

  
    if (existingItem) {
      alert(`${item.name} is already in the cart!`);
      return;
    }
  
    // Append the new item to the cart array
    item.quantity = 1; // Set initial quantity
    cart.push(item);
  
    // Store updated cart back into LocalStorage
    localStorage.setItem(`cart_${userEmail}`, JSON.stringify(cart));
  
    alert(`${item.name} has been added to your cart!`);
  
    // Redirect to cart page
    this.cartService.setItemDetails(item);
    //this.router.navigate(['/cart']);
  }
  
  
  

}  