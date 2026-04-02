import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-sales-filters',
  imports: [],
  templateUrl: './sales-filters.html',
  styleUrl: './sales-filters.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesFilters {
  readonly dateRange = input('This Month');
  readonly status = input('All');

  readonly dateRangeChange = output<string>();
  readonly statusChange = output<string>();

  onDateRange(event: Event): void {
    this.dateRangeChange.emit((event.target as HTMLSelectElement).value);
  }

  onStatus(event: Event): void {
    this.statusChange.emit((event.target as HTMLSelectElement).value);
  }
}
