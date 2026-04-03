import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CatalogProduct } from '../../../components/user/home/home.models';

@Component({
  selector: 'app-product-card',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<CatalogProduct>();
  readonly addingToCart = input(false);
  readonly wishlisted = input(false);
  readonly wishlistLoading = input(false);

  readonly addToCart = output<void>();
  readonly toggleWishlist = output<void>();

  readonly stars = [1, 2, 3, 4, 5] as const;

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit();
  }

  onToggleWishlist(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleWishlist.emit();
  }
}
