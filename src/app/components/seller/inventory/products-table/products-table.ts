import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SellerProduct } from '../../../../services/seller/inventory.service';

@Component({
  selector: 'app-products-table',
  imports: [CurrencyPipe],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsTable {
  readonly products = input.required<SellerProduct[]>();

  readonly edit = output<number>();
  readonly remove = output<number>();
  readonly toggleStatus = output<number>();
}
