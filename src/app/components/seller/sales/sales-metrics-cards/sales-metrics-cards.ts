import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SalesMetric } from '../../../../services/seller/sales.service';

@Component({
  selector: 'app-sales-metrics-cards',
  imports: [CurrencyPipe],
  templateUrl: './sales-metrics-cards.html',
  styleUrl: './sales-metrics-cards.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesMetricsCards {
  readonly metrics = input.required<SalesMetric[]>();
}
