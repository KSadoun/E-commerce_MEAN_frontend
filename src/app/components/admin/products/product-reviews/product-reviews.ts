import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Product } from '../../../../models/product';
import { Review } from '../../../../models/review';
import { ReviewService } from '../../../../services/admin/reviews';

@Component({
  selector: 'app-product-reviews',
  imports: [CommonModule, RouterModule],
  templateUrl: './product-reviews.html',
  styleUrl: './product-reviews.css',
})
export class ProductReviews implements OnInit {
  productId = 0;
  product: Product | null = null;
  reviews: Review[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef,
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
    this.isLoading = true;

    this.reviewService.getProductReviews(this.productId).subscribe(({ product, reviews }) => {
      this.product = product;
      this.reviews = reviews;
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  getStars(rating: number): string {
    const rounded = Math.max(1, Math.min(5, Math.round(rating)));
    return '★'.repeat(rounded) + '☆'.repeat(5 - rounded);
  }
}
