import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { DeliveryService } from '../services/delivery.service';
import { AgNavComponent } from '../ag-nav/ag-nav.component';

interface DeliveryPayload {
  orderId: number | null;
  agentId: number | null;
  estimatedTimeOfArrival: string | null; // Changed to string | null
  status: string | null;
}

@Component({
  selector: 'app-create-delivery',
  standalone: true,
  imports: [FormsModule, CommonModule,AgNavComponent,FooterComponent],
  templateUrl: './create-delivery.component.html',
  styleUrls: ['./create-delivery.component.css'],
})
export class CreateDeliveryComponent implements OnInit {
  newDelivery: DeliveryPayload = {
    orderId: null,
    agentId: null,
    estimatedTimeOfArrival: null,
    status: null,
  };
  loading: boolean = false;
  error: string | null = null;
  deliveryStatuses: string[] = ['INPROGRESS', 'DELIVERED'];

  constructor(private deliveryService: DeliveryService, private router: Router) {}

  ngOnInit(): void {
    this.setAutoEstimatedArrivalTime();
  }

  setAutoEstimatedArrivalTime(): void {
    const now = new Date();
    const arrivalTime = new Date(now.getTime() + 30 * 60 * 1000); // Add 30 minutes in milliseconds

    // Format the date and time to the datetime-local input format (YYYY-MM-DDTHH:mm)
    const year = arrivalTime.getFullYear();
    const month = (arrivalTime.getMonth() + 1).toString().padStart(2, '0');
    const day = arrivalTime.getDate().toString().padStart(2, '0');
    const hours = arrivalTime.getHours().toString().padStart(2, '0');
    const minutes = arrivalTime.getMinutes().toString().padStart(2, '0');

    this.newDelivery.estimatedTimeOfArrival = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  createDelivery(): void {
    this.loading = true;
    this.error = null;
    if (this.newDelivery.orderId !== null &&
      this.newDelivery.agentId !== null &&
      this.newDelivery.estimatedTimeOfArrival !== null &&
      this.newDelivery.status !== null) {
      const deliveryPayload = {
        ...this.newDelivery,
        estimatedTimeOfArrival: this.newDelivery.estimatedTimeOfArrival ? new Date(this.newDelivery.estimatedTimeOfArrival) : null,
      };
      this.deliveryService.createDelivery(deliveryPayload).subscribe({
        next: (createdDelivery) => {
          console.log('Delivery created:', createdDelivery);
          this.loading = false;
          this.router.navigate(['/deliveries']);
        },
        error: (error) => {
          this.error = error.message;
          console.error('Error creating delivery:', error);
          this.loading = false;
        },
      });
    } else {
      this.error = 'Please fill in all the required fields, including the status.';
      this.loading = false;
      console.warn('Please fill in all the required fields, including the status.');
    }
  }
}