import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SalesMetric, SalesOrder, SalesService } from '../../../services/seller/sales.service';
import { SalesMetricsCards } from './sales-metrics-cards/sales-metrics-cards';
import { SalesFilters } from './sales-filters/sales-filters';
import { SalesOrdersTable } from './orders-table/orders-table';

@Component({
  selector: 'app-seller-sales',
  imports: [SalesMetricsCards, SalesFilters, SalesOrdersTable],
  templateUrl: './sales.html',
  styleUrl: './sales.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerSales {
  private readonly salesService = inject(SalesService);

  readonly dateRange = signal('This Month');
  readonly status = signal('All');
  readonly metrics = signal<SalesMetric[]>([]);
  readonly orders = signal<SalesOrder[]>([]);

  readonly filteredOrders = computed(() =>
    this.orders().filter((order) => {
      const statusMatch = this.status() === 'All' || order.status === this.status();
      const orderDate = new Date(order.date);
      const now = new Date();

      if (Number.isNaN(orderDate.getTime())) {
        return statusMatch;
      }

      let dateMatch = true;
      if (this.dateRange() === 'Today') {
        dateMatch = orderDate.toDateString() === now.toDateString();
      } else if (this.dateRange() === 'This Week') {
        const diff = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24);
        dateMatch = diff <= 7 && diff >= 0;
      } else if (this.dateRange() === 'This Month') {
        dateMatch =
          orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }

      return statusMatch && dateMatch;
    }),
  );

  constructor() {
    this.salesService
      .getMetrics()
      .pipe(takeUntilDestroyed())
      .subscribe((metrics) => this.metrics.set(metrics));

    this.salesService
      .getOrders()
      .pipe(takeUntilDestroyed())
      .subscribe((orders) => this.orders.set(orders));
  }

  setDateRange(value: string): void {
    this.dateRange.set(value);
  }

  setStatus(value: string): void {
    this.status.set(value);
  }
}
