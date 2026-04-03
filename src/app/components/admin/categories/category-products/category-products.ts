import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/admin/categories';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-category-products',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './category-products.html',
  styleUrl: './category-products.css',
})
export class CategoryProducts implements OnInit {
  categoryId: number | null = null;
  products: Product[] = [];
  category: Category | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('categoryId');
      if (id) {
        this.categoryId = parseInt(id, 10);
        this.loadCategoryProducts();
      }
    });
  }

  loadCategoryProducts(): void {
    if (!this.categoryId) return;

    this.loadingService.show();
    this.categoryService.getCategoryProducts(this.categoryId).subscribe(
      (response: any) => {
        this.products = response.products;
        console.log(`Fetched ${this.products.length} products for category ${this.categoryId}`);
        this.loadingService.hide();

        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      (error) => {
        console.error('Error loading category products:', error);
        this.loadingService.hide();
        this.cdr.detectChanges();
      }
    );
  }

  get inStockCount(): number {
    return this.products.filter(p => p.stock > 0).length;
  }

  get outOfStockCount(): number {
    return this.products.filter(p => p.stock === 0).length;
  }

  getPrimaryImage(product: Product): string {
    return Array.isArray(product.image) && product.image.length > 0 ? product.image[0] : '';
  }

  getAverageRating(product: Product): number {
    if (!product.reviews || product.reviews.length === 0) {
      return 0;
    }

    const total = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / product.reviews.length;
  }

  goToProductReviews(productId: number): void {
    this.router.navigate(['/admin/products', productId, 'reviews']);
  }

  goBack(): void {
    this.router.navigate(['/admin/categories']);
  }
}
