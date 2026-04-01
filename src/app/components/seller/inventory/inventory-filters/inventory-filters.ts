import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-inventory-filters',
  imports: [],
  templateUrl: './inventory-filters.html',
  styleUrl: './inventory-filters.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryFilters {
  readonly search = input('');
  readonly category = input('All');
  readonly status = input('All');

  readonly searchChange = output<string>();
  readonly categoryChange = output<string>();
  readonly statusChange = output<string>();

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  onCategory(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.categoryChange.emit(value);
  }

  onStatus(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.statusChange.emit(value);
  }
}
