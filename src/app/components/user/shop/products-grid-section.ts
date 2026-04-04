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
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../services/cart/cart.service';
import { UserService } from '../../../services/admin/users';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-products-grid-section',
  imports: [DecimalPipe, ProductCard],
  templateUrl: './products-grid-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsGridSection {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly userService = inject(UserService);

  readonly products = input.required<ReadonlyArray<CatalogProduct>>();
  readonly materialOptions = input.required<ReadonlyArray<string>>();

  readonly visibleCount = signal(8);
  readonly maxSelectedPrice = signal(6000);
  readonly selectedMaterials = signal<Set<string>>(new Set());

  readonly addingToCart = signal<Record<string, boolean>>({});
  readonly wishlistLoading = signal<Record<string, boolean>>({});
  readonly wishlistedProductIds = signal<Set<number>>(new Set());
  readonly cartMessage = signal('');

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

    if (this.authService.isAuthenticated()) {
      this.loadWishlist();
    }
  }

  private loadWishlist(): void {
    this.userService.getMyWishlist().subscribe({
      next: (response: any) => {
        const ids = new Set<number>((response?.items || []).map((item: any) => Number(item.id)));
        this.wishlistedProductIds.set(ids);
      },
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

  isWishlisted(product: CatalogProduct): boolean {
    return this.wishlistedProductIds().has(product.backendId);
  }

  toggleWishlist(product: CatalogProduct): void {
    if (!this.authService.isAuthenticated()) {
      this.cartMessage.set('Please log in to manage your wishlist');
      setTimeout(() => this.cartMessage.set(''), 3000);
      return;
    }

    if (!product.backendId || product.backendId <= 0) {
      return;
    }

    const productKey = product.id;
    const isCurrentlyWishlisted = this.isWishlisted(product);
    this.wishlistLoading.update((state) => ({ ...state, [productKey]: true }));

    const request = isCurrentlyWishlisted
      ? this.userService.removeFromWishlist(product.backendId)
      : this.userService.addToWishlist(product.backendId);

    request.subscribe({
      next: () => {
        this.wishlistLoading.update((state) => ({ ...state, [productKey]: false }));
        this.wishlistedProductIds.update((ids) => {
          const next = new Set(ids);
          if (isCurrentlyWishlisted) {
            next.delete(product.backendId);
          } else {
            next.add(product.backendId);
          }
          return next;
        });
      },
      error: (err) => {
        this.wishlistLoading.update((state) => ({ ...state, [productKey]: false }));
        this.cartMessage.set(err.error?.message || 'Failed to update wishlist');
        setTimeout(() => this.cartMessage.set(''), 3000);
      },
    });
  }

  addToCart(product: CatalogProduct): void {
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
