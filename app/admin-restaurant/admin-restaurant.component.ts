import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminRestaurantService } from '../services/admin-restaurant.service';
import { ANavComponent } from '../a-nav/a-nav.component';
import { FooterComponent } from '../footer/footer.component';
 
@Component({
  selector: 'app-admin-restaurant',
  standalone: true,
  imports: [CommonModule, FormsModule,ANavComponent,FooterComponent],
  templateUrl: './admin-restaurant.component.html',
  styleUrls: ['./admin-restaurant.component.css'],
})
export class AdminRestaurantComponent implements OnInit {
  constructor(
    private adminRestaurantService: AdminRestaurantService,
    private route: ActivatedRoute
  ) {}
 
  // Component attributes
  actionType: string = 'add'; // Tracks the current action ('add', 'update', 'delete')
  itemId: string | null = null;
  restaurantId: string = '';
  name: string = '';
  description: string = '';
  price: string = '';
  file: File | null = null;
  imageUrl: string = '';
  isEditing: boolean = false;
  message: string = '';
  menuItems: any[] = [];
  showInputField: boolean = false;
  showMenuItems: boolean = false;
  menuLoaded: boolean = false;
 
  ngOnInit(): void {
    this.itemId = this.route.snapshot.paramMap.get('itemId');
    if (this.itemId && this.actionType === 'update') {
      this.isEditing = true;
      this.fetchMenuById(this.itemId);
    }
  }
 
  setAction(action: string): void {
    this.actionType = action;
    this.showInputField = false;
    this.showMenuItems=false;
    this.resetForm();
 
    if (action === 'add') {
      this.isEditing = false;
    } else if (action === 'update') {
      this.isEditing = true;
    } else if (action === 'delete') {
      this.isEditing = false;
    }
  }
 
  resetForm(): void {
    this.restaurantId = '';
    this.name = '';
    this.description = '';
    this.price = '';
    this.file = null;
    this.imageUrl = '';
    this.message = '';
  }
 
  fetchMenuById(menuId: string): void {
    this.adminRestaurantService.getMenuById(menuId).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          const menu = res.menu;
          this.restaurantId = menu.restaurantId;
          this.name = menu.name;
          this.description = menu.description;
          this.price = menu.price;
          this.imageUrl = menu.imageUrl;
        } else {
          this.showMessage(res.message);
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || 'Unable to fetch menu item');
      },
    });
  }
 
  handleImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      this.file = input.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.file);
    }
  }
 
  handleSubmit(event: Event): void {
    event.preventDefault();
 
    if (this.actionType === 'add') {
      this.addMenuItem();
    } else if (this.actionType === 'update') {
      this.updateMenuItem();
    } else if (this.actionType === 'delete') {
      this.deleteMenuItem();
    }
  }
 
  fetchMenuItems(event: Event) {
    event.preventDefault();
    const apiUrl = `http://localhost:9090/menu/${this.restaurantId}`;
   
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        console.log('Menu Items:', data);
        this.menuItems = data; // Update the UI-bound variable
        this.showMenuItems = true;
        this.menuLoaded=true;
        this.showInputField = false;
      })
      .catch(error => console.error('Error fetching menu items:', error));
  }
 
 
   // Show the input field when clicking "Get All Items"
   showRestaurantInput(): void {
    this.actionType = ''; // Reset actionType to ensure previous forms are hidden
    this.showInputField = true; // Show restaurant ID input field
    this.showMenuItems = false; // Hide menu items if they were previously displayed
  }
  
 
  addMenuItem(): void {
    const formData = new FormData();
    formData.append('restaurantId', this.restaurantId);
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('price', this.price);
    if (this.file) {
      formData.append('file', this.file);
    }
 
    //console.log('added');
    this.showMessage('Menu item added successfully');
 
    this.adminRestaurantService.addMenuItem(formData).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage('Menu item added successfully');
        }
      },
      error: (error) => {
        this.showMessage(error?.error?.message || 'Unable to add menu item');
      },
    });
  }
 
  updateMenuItem(): void {
    const formData = new FormData();
    formData.append('restaurantId', this.restaurantId);
    formData.append('name', this.name);
    formData.append('description', this.description);
    formData.append('price', this.price);
    if (this.file) {
      formData.append('file', this.file);
    }
    //this.showMessage('Menu item updated successfully');
    console.log(this.name);
    if (this.name) {
      this.showMessage('Menu item updated successfully');
      this.adminRestaurantService
        .updateMenuItem(this.restaurantId, this.name, formData)
        .subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.showMessage('Menu item updated successfully');
            }
          },
          error: (error) => {
            this.showMessage(
              error?.error?.message || 'Unable to update menu item'
            );
          },
        });
    }
  }
 
  deleteMenuItem(): void {
    if (this.restaurantId && this.name) {
      this.adminRestaurantService.deleteMenuItem(this.restaurantId, this.name).subscribe({
        next: (res: any) => {
          console.log('Response:', res);
          if (res.ok) {
              this.showMessage('Menu item deleted successfully');
          }
      },
      error: (error) => {
          console.log('Error:', error);
          this.showMessage(
              error?.error?.message || 'Menu item deleted successfully'
          );
      }
      
      });
    }
  }
 
 showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 30000);
  }
 
   
}
 