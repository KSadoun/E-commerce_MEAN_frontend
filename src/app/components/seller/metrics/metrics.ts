import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SellerMetric } from '../../../services/seller/seller-dashboard.service';

@Component({
  selector: 'app-seller-metrics',
  imports: [CurrencyPipe],
  templateUrl: './metrics.html',
  styleUrl: './metrics.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerMetrics {
  readonly metrics = input.required<SellerMetric[]>();
}
