import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { CategoryService } from '../../../../services/admin/categories';

@Component({
  selector: 'app-category-products',
  imports: [CommonModule, HttpClientModule],
  templateUrl: './category-products.html',
  styleUrl: './category-products.css',
})
export class CategoryProducts implements OnInit {
  categoryId: number | null = null;
  products: Product[] = [];
  isLoading = false;
  category: Category | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
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

    this.isLoading = true;
    this.categoryService.getCategoryProducts(this.categoryId).subscribe(
      (response: any) => {
        this.products = response.products;
        console.log(`Fetched ${this.products.length} products for category ${this.categoryId}`);
        this.isLoading = false;

        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      (error) => {
        console.error('Error loading category products:', error);
        this.isLoading = false;
      }
    );
  }

  get inStockCount(): number {
    return this.products.filter(p => p.stock > 0).length;
  }

  get outOfStockCount(): number {
    return this.products.filter(p => p.stock === 0).length;
  }

  goBack(): void {
    this.router.navigate(['/admin/categories']);
  }
}
