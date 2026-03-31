import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SellerCustomer } from '../../../../services/seller/customers.service';

@Component({
  selector: 'app-customers-table',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './customers-table.html',
  styleUrl: './customers-table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersTable {
  readonly customers = input.required<SellerCustomer[]>();

  readonly viewDetails = output<string>();
}
