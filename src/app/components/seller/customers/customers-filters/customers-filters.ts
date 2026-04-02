import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-customers-filters',
  imports: [],
  templateUrl: './customers-filters.html',
  styleUrl: './customers-filters.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersFilters {
  readonly search = input('');
  readonly segment = input('All');

  readonly searchChange = output<string>();
  readonly segmentChange = output<string>();

  onSearch(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }

  onSegment(event: Event): void {
    this.segmentChange.emit((event.target as HTMLSelectElement).value);
  }
}
