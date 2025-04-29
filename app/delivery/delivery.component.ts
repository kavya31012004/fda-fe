import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import RouterModule for routerLink
import { FooterComponent } from '../footer/footer.component';
import { AgNavComponent } from '../ag-nav/ag-nav.component';

interface Delivery {
  deliveryId: number;
  orderId: number;
  agentId: number;
  estimatedTimeOfArrival: string; // Backend sends LocalDateTime as string
  status: 'INPROGRESS' | 'DELIVERED' | string; // Add other possible statuses if needed
}

interface CreateDeliveryPayload {
  orderId: number | null;
  agentId: number | null;
  estimatedTimeOfArrival: string | null; // Send as string for creation
  status: string | null;
}

@Component({
  selector: 'app-delivery',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule,FooterComponent,AgNavComponent], // Add RouterModule to imports
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.css'],
  providers: [] // No need to provide HttpClient here, it's provided in AppModule
})
export class DeliveryComponent implements OnInit {
  agentId: number | null = null;
  deliveries: Delivery[] = [];
  errorMessage: string = '';
  hasSearched: boolean = false; // Add a flag to track if the user has searched
  apiUrl = 'http://localhost:9090/deliveries'; // Adjust if your backend runs on a different port or context path

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Optionally create initial deliveries on component initialization
    // this.createInitialDeliveries();
  }

  createInitialDeliveries(): void {
    const delivery1: CreateDeliveryPayload = {
      orderId: 101,
      agentId: 1,
      estimatedTimeOfArrival: new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' '), // ETA in 1 hour
      status: 'INPROGRESS'
    };

    const delivery2: CreateDeliveryPayload = {
      orderId: 102,
      agentId: 1,
      estimatedTimeOfArrival: new Date(Date.now() + 7200000).toISOString().slice(0, 19).replace('T', ' '), // ETA in 2 hours
      status: 'DELIVERED'
    };

    this.createDelivery(delivery1);
    this.createDelivery(delivery2);
  }

  createDelivery(deliveryData: CreateDeliveryPayload): void {
    this.http.post<Delivery>(`${this.apiUrl}/create`, deliveryData)
      .subscribe({
        next: (response) => {
          console.log('Delivery created:', response);
          // Optionally reload deliveries after creating
          // if (this.agentId) {
          //   this.loadDeliveries();
          // }
        },
        error: (error) => {
          console.error('Error creating delivery:', error);
        }
      });
  }

  loadDeliveries(): void {
    this.hasSearched = true; // Set the flag when the button is clicked
    if (this.agentId !== null) {
      this.errorMessage = '';
      this.http.get<Delivery[]>(`${this.apiUrl}/getAll/${this.agentId}`)
        .subscribe({
          next: (data) => {
            this.deliveries = data;
          },
          error: (error) => {
            this.errorMessage = 'Error fetching deliveries.';
            console.error('Error fetching deliveries:', error);
            this.deliveries = [];
          }
        });
    } else {
      this.errorMessage = 'Please enter an Agent ID.';
      this.deliveries = [];
    }
  }

  updateToInProgress(deliveryId: number): void {
    this.http.put<Delivery>(`${this.apiUrl}/inprogress/${deliveryId}`, {})
      .subscribe({
        next: (updatedDelivery) => {
          const index = this.deliveries.findIndex(d => d.deliveryId === deliveryId);
          if (index !== -1) {
            this.deliveries[index].status = updatedDelivery.status;
          }
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = `Error updating delivery ${deliveryId} to In Progress.`;
          console.error('Error updating delivery status:', error);
        }
      });
  }

  updateToDelivered(deliveryId: number): void {
    this.http.put<Delivery>(`${this.apiUrl}/delivered/${deliveryId}`, {})
      .subscribe({
        next: (updatedDelivery) => {
          const index = this.deliveries.findIndex(d => d.deliveryId === deliveryId);
          if (index !== -1) {
            this.deliveries[index].status = updatedDelivery.status;
          }
          this.errorMessage = '';
        },
        error: (error) => {
          this.errorMessage = `Error updating delivery ${deliveryId} to Delivered.`;
          console.error('Error updating delivery status:', error);
        }
      });
  }
}