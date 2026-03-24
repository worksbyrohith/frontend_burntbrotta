import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../../services/cart.service';
import { OrderService } from '../../../services/order.service';
import { OrderCreateDto } from '../../../models/interfaces';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  cartService = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  deliveryAddress: string = '';
  isProcessing: boolean = false;
  errorMessage: string = '';

  increaseQuantity(item: CartItem) {
    this.cartService.addToCart(item.menuItem);
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.removeFromCart(item.menuItem.itemId);
  }

  placeOrder() {
    if (!this.deliveryAddress.trim()) {
      this.errorMessage = 'Please provide a delivery address.';
      return;
    }

    const restaurantId = this.cartService.getRestaurantId();
    if (!restaurantId) return;

    let itemsInfo: CartItem[] = [];
    this.cartService.cartItems$.subscribe(items => itemsInfo = items).unsubscribe();
    
    if (!itemsInfo || itemsInfo.length === 0) return;

    const orderDto: OrderCreateDto = {
      restaurantId: restaurantId,
      deliveryAddress: this.deliveryAddress,
      items: itemsInfo.map(i => ({ itemId: i.menuItem.itemId, quantity: i.quantity }))
    };

    this.isProcessing = true;
    this.errorMessage = '';

    this.orderService.placeOrder(orderDto).subscribe({
      next: (order) => {
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation', order.orderId]);
      },
      error: (err) => {
        console.error(err);
        this.isProcessing = false;
        this.errorMessage = 'Failed to place order. Please try again.';
      }
    });
  }
}
