import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../models/interfaces';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-menu-item-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-item-card.component.html',
  styleUrl: './menu-item-card.component.css'
})
export class MenuItemCardComponent {
  @Input() item!: MenuItem;
  private cartService = inject(CartService);

  addToCart() {
    this.cartService.addToCart(this.item);
  }
}
