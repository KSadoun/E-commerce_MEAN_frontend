import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RecentOrder } from '../../../services/seller/seller-dashboard.service';

@Component({
  selector: 'app-seller-recent-orders',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './recent-orders.html',
  styleUrl: './recent-orders.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerRecentOrders {
  readonly orders = input.required<RecentOrder[]>();
}
