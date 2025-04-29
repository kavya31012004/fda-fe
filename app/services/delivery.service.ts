import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
  
  interface DeliveryPayload {
    orderId: number | null;
    agentId: number | null;
    estimatedTimeOfArrival: Date | null;
  }
  
  interface DeliveryDto {
    deliveryId: number;
    orderId: number;
    agentId: number;
    estimatedTimeOfArrival: string; // Backend sends LocalDateTime as String
    status: string;
  }
  
  @Injectable({
    providedIn: 'root',
  })
  export class DeliveryService {
    private baseUrl = 'http://localhost:9090/deliveries';
  
    constructor(private http: HttpClient) {}
  
  
    createDelivery(deliveryData: DeliveryPayload): Observable<DeliveryDto> {
      return this.http.post<DeliveryDto>(`${this.baseUrl}/create`, deliveryData);
    }
  
    getAllDeliveries(agentId: number): Observable<DeliveryDto[]> {
      return this.http.get<DeliveryDto[]>(`${this.baseUrl}/getAll/${agentId}`);
    }
  
    
  }
  