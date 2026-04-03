import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CatalogProduct } from './home.models';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../services/cart/cart.service';
import { UserService } from '../../../services/admin/users';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-top-products-section',
  imports: [ProductCard, RouterLink],
  templateUrl: './top-products-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopProductsSection {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly userService = inject(UserService);

  readonly products = input.required<ReadonlyArray<CatalogProduct>>();

  readonly addingToCart = signal<Record<string, boolean>>({});
  readonly wishlistLoading = signal<Record<string, boolean>>({});
  readonly wishlistedProductIds = signal<Set<number>>(new Set());
  readonly feedbackMessage = signal('');

  constructor() {
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

  isWishlisted(product: CatalogProduct): boolean {
    return this.wishlistedProductIds().has(product.backendId);
  }

  toggleWishlist(product: CatalogProduct): void {
    if (!this.authService.isAuthenticated()) {
      this.feedbackMessage.set('Please log in to manage your wishlist');
      setTimeout(() => this.feedbackMessage.set(''), 3000);
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
      error: (error) => {
        this.wishlistLoading.update((state) => ({ ...state, [productKey]: false }));
        this.feedbackMessage.set(error?.error?.message || 'Failed to update wishlist');
        setTimeout(() => this.feedbackMessage.set(''), 3000);
      },
    });
  }

  addToCart(product: CatalogProduct): void {
    if (!product.backendId || product.backendId <= 0) {
      this.feedbackMessage.set('This product is not available for purchase');
      setTimeout(() => this.feedbackMessage.set(''), 3000);
      return;
    }

    if (product.stock <= 0) {
      this.feedbackMessage.set('This product is out of stock');
      setTimeout(() => this.feedbackMessage.set(''), 3000);
      return;
    }

    this.addingToCart.update((state) => ({ ...state, [product.id]: true }));
    this.feedbackMessage.set('');

    this.cartService.addItem(product.backendId, 1).subscribe({
      next: () => {
        this.addingToCart.update((state) => ({ ...state, [product.id]: false }));
        this.feedbackMessage.set(`${product.title} added to cart!`);
        setTimeout(() => this.feedbackMessage.set(''), 2500);
      },
      error: (error) => {
        this.addingToCart.update((state) => ({ ...state, [product.id]: false }));
        this.feedbackMessage.set(error?.error?.message || 'Failed to add to cart');
        setTimeout(() => this.feedbackMessage.set(''), 3000);
      },
    });
  }
}
