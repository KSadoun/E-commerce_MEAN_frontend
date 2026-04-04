import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomersService, SellerCustomer } from '../../../services/seller/customers.service';
import { CustomersFilters } from './customers-filters/customers-filters';
import { CustomersTable } from './customers-table/customers-table';

@Component({
  selector: 'app-seller-customers',
  imports: [CustomersFilters, CustomersTable],
  templateUrl: './customers.html',
  styleUrl: './customers.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerCustomers {
  private readonly customersService = inject(CustomersService);

  readonly search = signal('');
  readonly segment = signal('All');
  readonly customers = signal<SellerCustomer[]>([]);

  readonly filteredCustomers = computed(() =>
    this.customers().filter((customer) => {
      const searchValue = this.search().toLowerCase();
      const searchMatch =
        customer.name.toLowerCase().includes(searchValue) ||
        customer.email.toLowerCase().includes(searchValue);

      if (this.segment() === 'Top') {
        return searchMatch && customer.totalSpend >= 1500;
      }

      if (this.segment() === 'Recent') {
        const lastOrder = new Date(customer.lastOrderDate);
        if (Number.isNaN(lastOrder.getTime())) {
          return false;
        }

        const now = new Date();
        const diffDays = (now.getTime() - lastOrder.getTime()) / (1000 * 60 * 60 * 24);
        return searchMatch && diffDays <= 7 && diffDays >= 0;
      }

      return searchMatch;
    }),
  );

  constructor() {
    this.customersService
      .getCustomers()
      .pipe(takeUntilDestroyed())
      .subscribe((customers) => this.customers.set(customers));
  }

  setSearch(value: string): void {
    this.search.set(value);
  }

  setSegment(value: string): void {
    this.segment.set(value);
  }

  onViewDetails(customerId: string): void {
    console.log('View customer details', customerId);
  }
}
