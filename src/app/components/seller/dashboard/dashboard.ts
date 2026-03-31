import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SellerDashboardService } from '../../../services/seller/seller-dashboard.service';
import { SellerMetrics } from '../metrics/metrics';
import { SellerRecentOrders } from '../recent-orders/recent-orders';

@Component({
  selector: 'app-seller-dashboard',
  imports: [SellerMetrics, SellerRecentOrders],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerDashboard {
  private readonly sellerDashboardService = inject(SellerDashboardService);

  readonly metrics = toSignal(this.sellerDashboardService.getMetrics(), { initialValue: [] });
  readonly recentOrders = toSignal(this.sellerDashboardService.getRecentOrders(), {
    initialValue: [],
  });
}
