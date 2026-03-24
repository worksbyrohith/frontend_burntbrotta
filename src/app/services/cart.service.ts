import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuItem } from '../models/interfaces';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private restaurantId: number | null = null;
  
  cartItems$ = this.cartItems.asObservable();

  addToCart(item: MenuItem) {
    // Restrict cart to one restaurant at a time as per spec
    if (this.restaurantId && this.restaurantId !== item.restaurantId) {
      if (confirm('Your cart contains items from another restaurant. Do you want to clear it and start fresh?')) {
        this.clearCart();
      } else {
        return;
      }
    }

    this.restaurantId = item.restaurantId;
    const currentItems = this.cartItems.value;
    const existing = currentItems.find(i => i.menuItem.itemId === item.itemId);

    if (existing) {
      existing.quantity++;
      this.cartItems.next([...currentItems]);
    } else {
      this.cartItems.next([...currentItems, { menuItem: item, quantity: 1 }]);
    }
  }

  removeFromCart(itemId: number) {
    const currentItems = this.cartItems.value;
    const existing = currentItems.find(i => i.menuItem.itemId === itemId);

    if (existing) {
      if (existing.quantity > 1) {
        existing.quantity--;
        this.cartItems.next([...currentItems]);
      } else {
        const remaining = currentItems.filter(i => i.menuItem.itemId !== itemId);
        this.cartItems.next(remaining);
        if (remaining.length === 0) {
          this.restaurantId = null;
        }
      }
    }
  }

  clearCart() {
    this.cartItems.next([]);
    this.restaurantId = null;
  }

  getTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  }

  getRestaurantId(): number | null {
    return this.restaurantId;
  }
}
