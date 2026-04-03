import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderService } from '../../../services/order/order.service';
import { Order } from '../../../models/order';
import { HomeHeader } from '../home/home-header';
import { HomeFooter } from '../home/home-footer';
import { COMPANY_DESCRIPTION, FOOTER_LINK_GROUPS, HOME_NAV_LINKS } from '../home/home.data';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, HomeHeader, HomeFooter],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';

  readonly navLinks = HOME_NAV_LINKS;
  readonly footerLinks = FOOTER_LINK_GROUPS;
  readonly companyDescription = COMPANY_DESCRIPTION;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

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
      case 'placed':
        return 'bg-blue-100 text-blue-700';
      case 'confirmed':
        return 'bg-indigo-100 text-indigo-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'pending_payment':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }
}
