import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order/order.service';
import { Order } from '../../../models/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef  
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (res) => {
        this.orders = res.orders;
        this.loading = false;
        this.cdr.detectChanges();   
      },
      error: () => {
        this.error = 'Failed to load orders';
        this.loading = false;
        this.cdr.detectChanges();  
      },
    });
  }

  viewOrder(id: number) {
    this.router.navigate(['/orders', id]);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'placed': return 'bg-blue-100 text-blue-700';
      case 'confirmed': return 'bg-indigo-100 text-indigo-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'pending_payment': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}