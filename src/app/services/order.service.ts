import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, OrderCreateDto } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http = inject(HttpClient);

  placeOrder(order: OrderCreateDto): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/orders`, order);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders/my`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
  }

  processPayment(orderId: number): Observable<any> {
    return this.http.post(`${environment.apiUrl}/payments/process/${orderId}`, {});
  }

  // Admin Methods
  getAllOrders(status?: string, date?: string): Observable<Order[]> {
    let queryParams = [];
    if (status) queryParams.push(`status=${status}`);
    if (date) queryParams.push(`date=${date}`);
    
    let url = `${environment.apiUrl}/orders`;
    if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
    }
    
    return this.http.get<Order[]>(url);
  }

  updateOrderStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/orders/${id}/status`, { status });
  }

  getAdminDashboard(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/admin/dashboard`);
  }
}
