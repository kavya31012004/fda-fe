// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private itemDetails: any;
//   private cartItems: any[] = [];
//   private cartCountSubject = new BehaviorSubject<number>(0);

//   cartCount$ = this.cartCountSubject.asObservable(); // Observable for real-time updates

//   setItemDetails(item: any): void {
//     this.itemDetails = item;
//   }

//   getItemDetails(): any {
//     return this.itemDetails;
//   }
 

//   setCartItems(items: any[]): void {
//     this.cartItems = items;
//     this.updateCartCount();
//   }

//   getCartItems(): any[] {
//     return this.cartItems;
//   }

//   updateCartCount(): void {
//     const count = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
//     this.cartCountSubject.next(count); // Emits updated count
//   }
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private itemDetails: any;
  private cartItems: any[] = [];
  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();
  
  
  
 
  /** Store item details */
  setItemDetails(item: any): void {
    this.itemDetails = item;
  }
 
  /** Retrieve item details */
  getItemDetails(): any {
    return this.itemDetails;
  }
 
  /** Set cart items and update count */
  setCartItems(items: any[]): void {
    this.cartItems = [...items]; // Ensuring immutability
    this.updateCartCount();
  }
 
  /** Get cart items */
  getCartItems(): any[] {
    return [...this.cartItems]; // Returning a copy for safe access
  }
 
  /** Update cart count based on item quantities */
  updateCartCount(): void {
    const totalCount = this.cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    this.cartCountSubject.next(totalCount); // Emits updated count to reflect in badge

    
  }
 
  /** Add an item to the cart */
  addItem(item: any): void {
    const existingItemIndex = this.cartItems.findIndex(cartItem => cartItem.id === item.id);
 
    if (existingItemIndex !== -1) {
      this.cartItems[existingItemIndex].quantity += 1;
    } else {
      this.cartItems.push({ ...item, quantity: 1 });
    }
 
    this.updateCartCount(); // Update badge count dynamically
  }
 
  /** Remove an item from the cart */
  removeItem(itemId: number): void {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    this.updateCartCount(); // Update badge count dynamically
  }
}