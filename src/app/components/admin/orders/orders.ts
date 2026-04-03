import { Component, ChangeDetectorRef, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderItem } from '../../../models/order';
import { OrderService } from '../../../services/admin/orders';
import { LoadingService } from '../../../core/services/loading.service';
import { DeleteConfirmModalComponent } from '../../../shared/components/delete-confirm-modal/delete-confirm-modal';

interface AdminOrderRow {
  orderId: number;
  userId: number | null;
  status: string;
  paymentStatus: string;
  items: OrderItem[];
  totalQuantity: number;
  totalAmount: number;
  sellerIds: number[];
}

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule, DeleteConfirmModalComponent],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Orders implements OnInit {
  orderItems: OrderItem[] = [];
  orders: AdminOrderRow[] = [];
  selectedSeller: string = '';
  expandedOrderIds = new Set<number>();
  isConfirmingDelivery = false;
  isDeliveryModalOpen = false;
  deliveryOrderId: number | null = null;
  deliveryOrderLabel = '';

  constructor(private orderService: OrderService, private cdr: ChangeDetectorRef, private loadingService: LoadingService) {}

  get uniqueSellers(): string[] {
    const sellers = this.orders.flatMap(order => order.sellerIds.map(sellerId => sellerId.toString()));
    return [...new Set(sellers)].filter(seller => seller);
  }

  get filteredOrders(): AdminOrderRow[] {
    if (!this.selectedSeller) {
      return this.orders;
    }
    return this.orders.filter(order => order.sellerIds.some(sellerId => sellerId.toString() === this.selectedSeller));
  }

  ngOnInit() {
    this.loadingService.show();
    this.orderService.getAllOrderItems().subscribe((items: OrderItem[]) => {
      this.orderItems = items;
      this.orders = this.buildOrders(items);
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  toggleOrderDetails(orderId: number) {
    if (this.expandedOrderIds.has(orderId)) {
      this.expandedOrderIds.delete(orderId);
    } else {
      this.expandedOrderIds.add(orderId);
    }
  }

  isOrderExpanded(orderId: number): boolean {
    return this.expandedOrderIds.has(orderId);
  }

  promptConfirmDelivery(order: AdminOrderRow) {
    this.deliveryOrderId = order.orderId;
    this.deliveryOrderLabel = `Order #${order.orderId}`;
    this.isDeliveryModalOpen = true;
    this.cdr.detectChanges();
  }

  cancelConfirmDelivery() {
    this.isDeliveryModalOpen = false;
    this.deliveryOrderId = null;
    this.deliveryOrderLabel = '';
    this.cdr.detectChanges();
  }

  confirmDelivery() {
    if (this.deliveryOrderId === null) {
      return;
    }

    const orderId = this.deliveryOrderId;
    this.isConfirmingDelivery = true;
    this.orderService.confirmCashOnDelivery(orderId).subscribe(() => {
      this.orders = this.orders.map(order =>
        order.orderId === orderId
          ? { ...order, status: 'delivered', paymentStatus: 'paid' }
          : order
      );
      this.orderService.clearCache();
      this.isConfirmingDelivery = false;
      this.cancelConfirmDelivery();
      this.cdr.detectChanges();
    }, () => {
      this.isConfirmingDelivery = false;
      this.cdr.detectChanges();
    });
  }

  private buildOrders(items: OrderItem[]): AdminOrderRow[] {
    const grouped = new Map<number, AdminOrderRow>();

    for (const item of items) {
      if (item._orderId === undefined) {
        continue;
      }

      const orderId = item._orderId;
      const existing = grouped.get(orderId);

      if (!existing) {
        grouped.set(orderId, {
          orderId,
          userId: item._userId ?? null,
          status: item.orderStatus ?? 'unknown',
          paymentStatus: item.paymentStatus ?? 'unknown',
          items: [item],
          totalQuantity: item.quantity,
          totalAmount: item.lineTotal,
          sellerIds: [item.sellerId],
        });
        continue;
      }

      existing.items.push(item);
      existing.totalQuantity += item.quantity;
      existing.totalAmount += item.lineTotal;
      if (!existing.sellerIds.includes(item.sellerId)) {
        existing.sellerIds.push(item.sellerId);
      }
    }

    return Array.from(grouped.values()).sort((a, b) => b.orderId - a.orderId);
  }

  getOrderStatusClass(status?: string): string {
    const baseClass = 'rounded-lg px-3 py-1 text-xs font-semibold';
    
    switch(status) {
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

