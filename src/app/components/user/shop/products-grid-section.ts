import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { CatalogProduct } from '../home/home.models';
import { CartService } from '../../../services/cart/cart.service';

@Component({
  selector: 'app-products-grid-section',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './products-grid-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsGridSection {
  private readonly cartService = inject(CartService);

  readonly products = input.required<ReadonlyArray<CatalogProduct>>();
  readonly materialOptions = input.required<ReadonlyArray<string>>();

  readonly visibleCount = signal(8);
  readonly maxSelectedPrice = signal(6000);
  readonly selectedMaterials = signal<Set<string>>(new Set());

  readonly addingToCart = signal<Record<string, boolean>>({});
  readonly cartMessage = signal('');

  // حساب أقل سعر موجود في المنتجات المعروضة
  readonly lowestPrice = computed(() => {
    const prices = this.products().map((p) => p.price);
    return prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  });

  // حساب أعلى سعر موجود في المنتجات المعروضة
  readonly highestPrice = computed(() => {
    const prices = this.products().map((p) => p.price);
    return prices.length > 0 ? Math.ceil(Math.max(...prices)) : 6000;
  });

  readonly filteredProducts = computed(() =>
    this.products().filter((product) => {
      const matchesPrice = product.price <= this.maxSelectedPrice();
      const chosenMaterials = this.selectedMaterials();
      const matchesMaterial =
        chosenMaterials.size === 0 || chosenMaterials.has(product.material);
      return matchesPrice && matchesMaterial;
    }),
  );

  readonly visibleProducts = computed(() =>
    this.filteredProducts().slice(0, this.visibleCount()),
  );
  readonly canLoadMore = computed(
    () => this.visibleCount() < this.filteredProducts().length,
  );

  constructor() {
    // يجعل السلايدر يبدأ دائماً من أعلى سعر متاح عند تحميل الصفحة
    effect(() => {
      const topPrice = this.highestPrice();
      this.maxSelectedPrice.set(topPrice);
    }, { allowSignalWrites: true });
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

  addToCart(product: CatalogProduct, event: Event): void {
    event.stopPropagation();

    if (!product.backendId || product.backendId <= 0) {
      this.cartMessage.set('This product is not available for purchase');
      setTimeout(() => this.cartMessage.set(''), 3000);
      return;
    }

    if (product.stock <= 0) {
      this.cartMessage.set('This product is out of stock');
      setTimeout(() => this.cartMessage.set(''), 3000);
      return;
    }

    this.addingToCart.update((state) => ({ ...state, [product.id]: true }));
    this.cartMessage.set('');

    this.cartService.addItem(product.backendId, 1).subscribe({
      next: () => {
        this.addingToCart.update((state) => ({ ...state, [product.id]: false }));
        this.cartMessage.set(`${product.title} added to cart!`);
        setTimeout(() => this.cartMessage.set(''), 2000);
      },
      error: (err) => {
        this.addingToCart.update((state) => ({ ...state, [product.id]: false }));
        this.cartMessage.set(err.error?.message || 'Failed to add to cart');
        setTimeout(() => this.cartMessage.set(''), 3000);
      },
    });
  }
}