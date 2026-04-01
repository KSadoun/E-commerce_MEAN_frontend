import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SalesOrder } from '../../../../services/seller/sales.service';

@Component({
  selector: 'app-sales-orders-table',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './orders-table.html',
  styleUrl: './orders-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesOrdersTable {
  readonly orders = input.required<SalesOrder[]>();
}
