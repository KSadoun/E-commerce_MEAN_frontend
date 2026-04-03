import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../../../models/product';
import { Review } from '../../../../models/review';
import { ReviewService } from '../../../../services/admin/reviews';
import { DeleteConfirmModalComponent } from '../../../../shared/components/delete-confirm-modal/delete-confirm-modal';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-product-reviews',
  imports: [CommonModule, RouterLink, DeleteConfirmModalComponent],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css',
})
export class ProductReviews implements OnInit {
  productId = 0;
  product: Product | null = null;
  reviews: Review[] = [];
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

  deleteReview(): void {
    if (this.deletingReviewId === null) {
      return;
    }

    const reviewId = this.deletingReviewId;
    this.isDeleting = true;
    this.loadingService.show();
    this.reviewService.deleteReview(reviewId).subscribe(() => {
      this.reviews = this.reviews.filter(review => review.id !== reviewId);
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
}
