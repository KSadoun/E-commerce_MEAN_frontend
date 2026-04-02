import { Component, ChangeDetectorRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderItem } from '../../../models/order';
import { OrderService } from '../../../services/admin/orders';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orders implements OnInit {
  orderItems: OrderItem[] = [];
  selectedSeller: string = '';

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef, private loadingService: LoadingService) {}

  get uniqueSellers(): string[] {
    const sellers = this.orderItems.map(item => item.sellerId.toString());
    return [...new Set(sellers)].filter(seller => seller);
  }

  get filteredOrderItems(): OrderItem[] {
    if (!this.selectedSeller) {
      return this.orderItems;
    }
    return this.orderItems.filter(item => item.sellerId.toString() === this.selectedSeller);
  }

  ngOnInit() {
    this.loadingService.show();
    this.orderService.getAllOrderItems().subscribe((items: OrderItem[]) => {
      this.orderItems = items;
      console.log('Fetched order items:', this.orderItems);
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  getOrderStatusClass(status?: string): string {
    const baseClass = 'rounded-lg px-3 py-1 text-xs font-semibold';

    switch (status) {
      case 'delivered':
        return `${baseClass} bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300`;
      case 'shipped':
        return `${baseClass} bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300`;
      case 'processing':
        return `${baseClass} bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300`;
      case 'pending_payment':
        return `${baseClass} bg-slate-100/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300`;
      case 'cancelled':
        return `${baseClass} bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300`;
      default:
        return `${baseClass} bg-slate-100/80 text-slate-700 dark:bg-slate-800 dark:text-slate-300`;
    }
  }
}

