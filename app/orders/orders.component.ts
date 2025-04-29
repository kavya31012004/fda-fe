import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { CNavComponent } from '../c-nav/c-nav.component';

@Component({
  selector: 'app-orders',
  imports: [CommonModule,FormsModule,FooterComponent,CNavComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})

export class OrdersComponent implements OnInit {
  emailId = '';
  orders: any[] = [];

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.emailId = localStorage.getItem("userEmail") || '';
    if (this.emailId) {
      this.orders = JSON.parse(localStorage.getItem(`orders_${this.emailId}`) || '[]');
    }
  }
}