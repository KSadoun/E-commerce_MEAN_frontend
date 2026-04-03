import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  computed,
  inject,
  signal,
} from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

import { COMPANY_DESCRIPTION, FOOTER_LINK_GROUPS, HOME_NAV_LINKS } from '../home/home.data';
import { HomeHeader } from '../home/home-header';
import { HomeFooter } from '../home/home-footer';
import { ProductDetails, ProductReview } from '../home/home.models';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../services/cart/cart.service';
import { HomeCatalogService } from '../../../services/user/home-catalog.service';

@Component({
  selector: 'app-product-details-page',
  imports: [DatePipe, DecimalPipe, FormsModule, RouterLink, HomeHeader, HomeFooter],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);
  private readonly catalogService = inject(HomeCatalogService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isAuthenticated = signal(this.authService.isAuthenticated());
  readonly currentUserId = signal<number | null>(this.authService.getCurrentUserId());
  readonly currentProductId = signal<number | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly product = signal<ProductDetails | null>(null);

  readonly activeImageIndex = signal(0);
  readonly selectedQuantity = signal(1);
  readonly addingToCart = signal(false);
  readonly cartMessage = signal('');
  readonly reviewRating = signal(5);
  readonly reviewComment = signal('');
  readonly reviewSubmitting = signal(false);
  readonly reviewMessage = signal('');
  readonly reviewError = signal('');
  readonly reviewStars = [1, 2, 3, 4, 5] as const;
  readonly openReviewMenuId = signal<number | null>(null);
  readonly editModalOpen = signal(false);
  readonly deleteModalOpen = signal(false);
  readonly editingReviewId = signal<number | null>(null);
  readonly deletingReviewId = signal<number | null>(null);
  readonly editReviewRating = signal(5);
  readonly editReviewComment = signal('');

  readonly myReviewIds = computed(() => {
    const userId = this.currentUserId();
    const product = this.product();
    if (!userId || !product) {
      return new Set<number>();
    }

    return new Set(
      product.reviews
        .filter((review) => Number(review.userId) === Number(userId))
        .map((review) => Number(review.id)),
    );
  });

  readonly myReview = computed(() => this.findMyReview(this.product()));

  readonly activeImage = computed(() => {
    const product = this.product();
    if (!product || !product.images.length) {
      return '';
    }

    const safeIndex = Math.min(this.activeImageIndex(), product.images.length - 1);
    return product.images[safeIndex];
  });

  readonly hasMultipleImages = computed(() => {
    const product = this.product();
    return Boolean(product && product.images.length > 1);
  });

  readonly navLinks = HOME_NAV_LINKS;
  readonly footerLinks = FOOTER_LINK_GROUPS;
  readonly companyDescription = COMPANY_DESCRIPTION;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = Number(params.get('id'));

      if (!Number.isInteger(id) || id <= 0) {
        this.currentProductId.set(null);
        this.loading.set(false);
        this.errorMessage.set('Invalid product id.');
        return;
      }

      this.currentProductId.set(id);
      this.reviewMessage.set('');
      this.reviewError.set('');
      this.selectedQuantity.set(1);
      this.closeAllReviewMenusAndModals();
      this.loadProduct(id);
    });

    const updateAuthState = (): void => {
      this.isAuthenticated.set(this.authService.isAuthenticated());
      this.currentUserId.set(this.authService.getCurrentUserId());
      this.populateReviewForm(this.product());
    };

    window.addEventListener('storage', updateAuthState);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('storage', updateAuthState);
    });
  }

  private findMyReview(product: ProductDetails | null): ProductReview | null {
    const userId = this.currentUserId();
    if (!product || !userId) {
      return null;
    }

    return product.reviews.find((review) => Number(review.userId) === Number(userId)) || null;
  }

  private populateReviewForm(product: ProductDetails | null): void {
    const existingReview = this.findMyReview(product);
    if (existingReview) {
      this.reviewRating.set(existingReview.rating);
      this.reviewComment.set(existingReview.comment || '');
      return;
    }

    this.reviewRating.set(5);
    this.reviewComment.set('');
  }

  private loadProduct(productId: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.catalogService
      .getProductDetails(productId)
      .pipe(
        catchError((error) => {
          this.errorMessage.set(
            error?.error?.message || 'Unable to load product details right now.',
          );
          return of(null);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((product) => {
        this.product.set(product);
        this.activeImageIndex.set(0);
        this.populateReviewForm(product);
        this.selectedQuantity.set(1);
        this.loading.set(false);
      });
  }

  private closeAllReviewMenusAndModals(): void {
    this.openReviewMenuId.set(null);
    this.editModalOpen.set(false);
    this.deleteModalOpen.set(false);
    this.editingReviewId.set(null);
    this.deletingReviewId.set(null);
    this.editReviewRating.set(5);
    this.editReviewComment.set('');
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openReviewMenuId.set(null);
  }

  increaseQuantity(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    if (this.selectedQuantity() >= product.stock) {
      this.cartMessage.set(`Only ${product.stock} item(s) available.`);
      setTimeout(() => this.cartMessage.set(''), 2500);
      return;
    }

    this.selectedQuantity.update((value) => value + 1);
  }

  decreaseQuantity(): void {
    if (this.selectedQuantity() <= 1) {
      return;
    }

    this.selectedQuantity.update((value) => value - 1);
  }

  toggleReviewMenu(reviewId: number, event: Event): void {
    event.stopPropagation();
    this.openReviewMenuId.update((current) => (current === reviewId ? null : reviewId));
  }

  openEditReviewModal(review: ProductReview, event: Event): void {
    event.stopPropagation();
    this.openReviewMenuId.set(null);
    this.editingReviewId.set(review.id);
    this.editReviewRating.set(review.rating);
    this.editReviewComment.set(review.comment || '');
    this.editModalOpen.set(true);
    this.deleteModalOpen.set(false);
  }

  openDeleteReviewModal(review: ProductReview, event: Event): void {
    event.stopPropagation();
    this.openReviewMenuId.set(null);
    this.deletingReviewId.set(review.id);
    this.deleteModalOpen.set(true);
    this.editModalOpen.set(false);
  }

  closeReviewEditModal(): void {
    this.editModalOpen.set(false);
    this.editingReviewId.set(null);
    this.editReviewRating.set(5);
    this.editReviewComment.set('');
  }

  closeReviewDeleteModal(): void {
    this.deleteModalOpen.set(false);
    this.deletingReviewId.set(null);
  }

  saveReviewEdit(): void {
    const product = this.product();
    const reviewId = this.editingReviewId();
    if (!product || reviewId === null) {
      return;
    }

    const rating = Number(this.editReviewRating());
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      this.reviewError.set('Please choose a rating between 1 and 5.');
      return;
    }

    this.reviewSubmitting.set(true);
    this.reviewError.set('');
    this.reviewMessage.set('');

    this.catalogService
      .updateProductReview(product.id, reviewId, {
        rating,
        comment: this.editReviewComment().trim(),
      })
      .subscribe({
        next: () => {
          this.reviewSubmitting.set(false);
          this.closeReviewEditModal();
          this.reviewMessage.set('Your review has been updated.');
          const productId = this.currentProductId();
          if (productId) {
            this.loadProduct(productId);
          }
        },
        error: (error) => {
          this.reviewSubmitting.set(false);
          this.reviewError.set(error?.error?.message || 'Failed to update review.');
        },
      });
  }

  confirmReviewDelete(): void {
    const product = this.product();
    const reviewId = this.deletingReviewId();
    if (!product || reviewId === null) {
      return;
    }

    this.reviewSubmitting.set(true);
    this.reviewError.set('');
    this.reviewMessage.set('');

    this.catalogService.deleteProductReview(product.id, reviewId).subscribe({
      next: () => {
        this.reviewSubmitting.set(false);
        this.closeReviewDeleteModal();
        this.reviewMessage.set('Your review has been deleted.');
        const productId = this.currentProductId();
        if (productId) {
          this.loadProduct(productId);
        }
      },
      error: (error) => {
        this.reviewSubmitting.set(false);
        this.reviewError.set(error?.error?.message || 'Failed to delete review.');
      },
    });
  }

  selectImage(index: number): void {
    this.activeImageIndex.set(index);
  }

  nextImage(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    this.activeImageIndex.update((index) => (index + 1) % product.images.length);
  }

  prevImage(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    this.activeImageIndex.update(
      (index) => (index - 1 + product.images.length) % product.images.length,
    );
  }

  addToCart(): void {
    const product = this.product();
    if (!product) {
      return;
    }

    const quantity = Number(this.selectedQuantity());
    if (!Number.isInteger(quantity) || quantity < 1) {
      this.cartMessage.set('Please choose a valid quantity.');
      setTimeout(() => this.cartMessage.set(''), 2500);
      return;
    }

    if (product.stock <= 0) {
      this.cartMessage.set('This product is currently out of stock.');
      setTimeout(() => this.cartMessage.set(''), 2500);
      return;
    }

    if (quantity > product.stock) {
      this.cartMessage.set(`Only ${product.stock} item(s) available.`);
      setTimeout(() => this.cartMessage.set(''), 2500);
      return;
    }

    this.addingToCart.set(true);
    this.cartMessage.set('');

    this.cartService.addItem(product.id, quantity).subscribe({
      next: () => {
        this.addingToCart.set(false);
        this.cartMessage.set(`${quantity} item(s) added to cart.`);
        setTimeout(() => this.cartMessage.set(''), 2500);
      },
      error: (error) => {
        this.addingToCart.set(false);
        this.cartMessage.set(error?.error?.message || 'Failed to add product to cart.');
        setTimeout(() => this.cartMessage.set(''), 3000);
      },
    });
  }

  setReviewRating(rating: number): void {
    this.reviewRating.set(rating);
  }

  submitReview(): void {
    if (!this.isAuthenticated()) {
      this.reviewError.set('Please log in to submit a review.');
      this.reviewMessage.set('');
      return;
    }

    const product = this.product();
    if (!product) {
      return;
    }

    const rating = Number(this.reviewRating());
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      this.reviewError.set('Please choose a rating between 1 and 5.');
      this.reviewMessage.set('');
      return;
    }

    const payload = {
      rating,
      comment: this.reviewComment().trim(),
    };

    const existingReview = this.myReview();
    if (existingReview) {
      this.reviewError.set('You already reviewed this product. Use the review menu to update it.');
      this.reviewMessage.set('');
      return;
    }

    this.reviewSubmitting.set(true);
    this.reviewError.set('');
    this.reviewMessage.set('');

    const request = this.catalogService.createProductReview(product.id, payload);

    request.subscribe({
      next: () => {
        this.reviewSubmitting.set(false);
        this.reviewMessage.set('Review submitted.');
        const productId = this.currentProductId();
        if (productId) {
          this.loadProduct(productId);
        }
      },
      error: (error) => {
        this.reviewSubmitting.set(false);
        this.reviewError.set(error?.error?.message || 'Failed to submit review.');
      },
    });
  }
}
