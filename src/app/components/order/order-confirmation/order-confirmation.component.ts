import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/interfaces';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  orderId: number = 0;
  order: Order | null = null;
  isLoading = true;
  paymentProcessing = false;
  paymentSuccess = false;
  paymentError = '';

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.orderId = +idParam;
      this.loadOrder();
    }
  }

  loadOrder() {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (data) => {
        this.order = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  processPayment() {
    this.paymentProcessing = true;
    this.paymentError = '';

    this.orderService.processPayment(this.orderId).subscribe({
      next: () => {
        this.paymentProcessing = false;
        this.paymentSuccess = true;
        if (this.order) {
           this.order.status = 'Confirmed';
        }
      },
      error: (err) => {
        this.paymentProcessing = false;
        this.paymentError = 'Payment failed. Please try again.';
      }
    });
  }
}
