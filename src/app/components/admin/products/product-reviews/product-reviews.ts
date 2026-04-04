import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { Review } from '../../../../models/review';
import { ReviewService } from '../../../../services/admin/reviews';
import { LoadingService } from '../../../../core/services/loading.service';
import { DeleteConfirmModalComponent } from '../../../../shared/components/delete-confirm-modal/delete-confirm-modal';

@Component({
  selector: 'app-product-reviews',
  imports: [CommonModule, DeleteConfirmModalComponent],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css',
})
export class ProductReviews implements OnInit {
  productId = 0;
  product: Product | null = null;
  reviews: Review[] = [];
  page = 1;
  readonly pageSize = 6;
  isDeleteModalOpen = false;
  deletingReviewId: number | null = null;
  deletingReviewName = '';
  isDeleting = false;
  private reviewService = inject(ReviewService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService,
  ) {}

  get averageRating(): number {
    if (!this.reviews.length) {
      return 0;
    }

    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / this.reviews.length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.reviews.length / this.pageSize));
  }

  get paginatedReviews(): Review[] {
    const start = (this.page - 1) * this.pageSize;
    return this.reviews.slice(start, start + this.pageSize);
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.productId = Number(idParam);

    if (!this.productId || Number.isNaN(this.productId)) {
      this.router.navigate(['/admin/products']);
      return;
    }

    this.loadProductReviews();
  }

  loadProductReviews(): void {
    this.loadingService.show();

    this.reviewService.getProductReviews(this.productId).subscribe(({ product, reviews }) => {
      this.product = product;
      this.reviews = reviews;
      this.page = 1;
      this.loadingService.hide();
      this.cdr.detectChanges();
    }, () => {
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  getStars(rating: number): string {
    const rounded = Math.max(1, Math.min(5, Math.round(rating)));
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  }

  confirmDeleteReview(review: Review): void {
    const confirmed = confirm(`Delete review #${review.id}? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    this.deleteReview(review.id);
  }

  promptDeleteReview(review: Review): void {
    this.deletingReviewId = review.id;
    this.deletingReviewName = `Review #${review.id}`;
    this.isDeleteModalOpen = true;
    this.cdr.detectChanges();
  }

  cancelDeleteReview(): void {
    this.isDeleteModalOpen = false;
    this.deletingReviewId = null;
    this.deletingReviewName = '';
    this.cdr.detectChanges();
  }

  deleteReview(targetReviewId?: number): void {
    const resolvedId = targetReviewId ?? this.deletingReviewId;
    if (resolvedId === null || resolvedId === undefined) {
      return;
    }

    const reviewId = resolvedId;
    this.isDeleting = true;
    this.loadingService.show();
    this.reviewService.deleteReview(reviewId).subscribe(() => {
      this.reviews = this.reviews.filter(review => review.id !== reviewId);
      if (this.page > this.totalPages) {
        this.page = this.totalPages;
      }
      this.reviewService.clearProductCache();
      this.isDeleting = false;
      this.loadingService.hide();
      this.cancelDeleteReview();
      this.cdr.detectChanges();
    }, () => {
      this.isDeleting = false;
      this.loadingService.hide();
      this.cdr.detectChanges();
    });
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  goBackToProducts(): void {
    this.router.navigate(['/admin/products']);
  }
}
