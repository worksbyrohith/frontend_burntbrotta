import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/interfaces';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LoaderComponent],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = true;
  statusFilter = '';

  private orderService = inject(OrderService);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  filterOrders() {
    if (!this.statusFilter) {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.statusFilter);
    }
  }

  updateStatus(id: number, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.orderService.updateOrderStatus(id, newStatus).subscribe({
      next: () => {
        // Find and update locally to prevent full reload
        const idx = this.orders.findIndex(o => o.orderId === id);
        if (idx !== -1) {
          this.orders[idx].status = newStatus;
          this.filterOrders(); // Re-apply filter just in case
        }
      },
      error: (err) => console.error(err)
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Confirmed': return 'bg-info text-dark';
      case 'Preparing': return 'bg-primary';
      case 'Out for Delivery': return 'bg-purple text-white';
      case 'Delivered': return 'bg-success';
      case 'Cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}
