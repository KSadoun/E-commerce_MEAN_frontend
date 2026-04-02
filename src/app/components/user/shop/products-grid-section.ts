import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { CatalogProduct } from '../home/home.models';

@Component({
  selector: 'app-products-grid-section',
  imports: [DecimalPipe],
  templateUrl: './products-grid-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsGridSection {
  readonly products = input.required<ReadonlyArray<CatalogProduct>>();
  readonly materialOptions = input.required<ReadonlyArray<string>>();
  readonly preselectedMaterial = input<string | null>(null);

  readonly visibleCount = signal(8);
  readonly maxSelectedPrice = signal(6000);
  readonly selectedMaterials = signal<Set<string>>(new Set());

  readonly highestPrice = computed(() =>
    Math.max(...this.products().map((product) => product.price), 6000),
  );

  readonly filteredProducts = computed(() =>
    this.products().filter((product) => {
      const matchesPrice = product.price <= this.maxSelectedPrice();
      const chosenMaterials = this.selectedMaterials();
      const matchesMaterial = chosenMaterials.size === 0 || chosenMaterials.has(product.material);
      return matchesPrice && matchesMaterial;
    }),
  );

  readonly visibleProducts = computed(() => this.filteredProducts().slice(0, this.visibleCount()));
  readonly canLoadMore = computed(() => this.visibleCount() < this.filteredProducts().length);

  constructor() {
    effect(() => {
      const topPrice = this.highestPrice();
      this.maxSelectedPrice.set(topPrice);
    });

    effect(() => {
      const material = this.preselectedMaterial();
      if (material) {
        this.selectedMaterials.set(new Set([material]));
      }
      this.visibleCount.set(8);
    });
  }

  loadMore(): void {
    this.visibleCount.update((value) => value + 4);
  }

  setMaxPrice(rawValue: string): void {
    this.maxSelectedPrice.set(Number(rawValue));
    this.visibleCount.set(8);
  }

  toggleMaterial(material: string, checked: boolean): void {
    this.selectedMaterials.update((items) => {
      const next = new Set(items);
      if (checked) {
        next.add(material);
      } else {
        next.delete(material);
      }
      return next;
    });
    this.visibleCount.set(8);
  }
}
