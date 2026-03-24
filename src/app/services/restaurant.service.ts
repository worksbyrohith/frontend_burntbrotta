import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Restaurant, MenuItem } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private http = inject(HttpClient);

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${environment.apiUrl}/restaurants`);
  }

  getRestaurantById(id: number): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${environment.apiUrl}/restaurants/${id}`);
  }
  
  getMenuByRestaurant(restaurantId: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${environment.apiUrl}/menuitems/restaurant/${restaurantId}`);
  }

  // Admin Methods
  createRestaurant(data: any): Observable<Restaurant> {
    return this.http.post<Restaurant>(`${environment.apiUrl}/restaurants`, data);
  }

  updateRestaurant(id: number, data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/restaurants/${id}`, data);
  }

  deleteRestaurant(id: number): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/restaurants/${id}`);
  }

  createMenuItem(data: any): Observable<MenuItem> {
    return this.http.post<MenuItem>(`${environment.apiUrl}/menuitems`, data);
  }
  
  updateMenuItem(id: number, data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/menuitems/${id}`, data);
  }
  
  toggleMenuItemAvailability(id: number): Observable<any> {
    return this.http.patch(`${environment.apiUrl}/menuitems/${id}/availability`, {});
  }
}
