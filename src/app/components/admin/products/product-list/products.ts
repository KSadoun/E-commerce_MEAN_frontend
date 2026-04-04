import { Component, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/admin/products';
import { CategoryService } from '../../../../services/admin/categories';
import { DeleteConfirmModalComponent } from '../../../../shared/components/delete-confirm-modal/delete-confirm-modal';
import { LoadingService } from '../../../../core/services/loading.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, HttpClientModule, DeleteConfirmModalComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
  providers: [],
})
export class Products implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  isDeleting = false;
  selectedCategory: string = '';
  page = 1;
  readonly pageSize = 6;
  isDeleteModalOpen = false;
  deletingProductId: number | null = null;
  deletingProductName = '';

  constructor(
    @Inject(ProductService) private productService: ProductService,
    @Inject(CategoryService) private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private loadingService: LoadingService,
  ) {}

  get filteredProducts(): Product[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    return this.products.filter(product => product.categoryId.toString() === this.selectedCategory);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get paginatedProducts(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  getPrimaryImage(product: Product): string {
    const candidate = product.images ?? product.image;

    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate[0];
    }

    if (typeof candidate === 'string') {
      return candidate;
    }

    return '';
  }

  getAverageRating(product: Product): number {
    if (!product.reviews || product.reviews.length === 0) {
      return 0;
    }

    const total = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / product.reviews.length;
  }

  isProductActive(product: Product): boolean {
    if (typeof product.isActive === 'boolean') {
      return product.isActive;
    }

    return (product.status ?? '').toLowerCase() === 'active';
  }

  productStatusLabel(product: Product): 'Active' | 'Pending' | 'Rejected' {
    const status = (product.status ?? '').toLowerCase();

    if (status === 'active' || this.isProductActive(product)) {
      return 'Active';
    }

    if (status === 'pending') {
      return 'Pending';
    }

    return 'Rejected';
  }

  ngOnInit() {
    this.loadingService.show();
    this.categoryService.getAllCategories().subscribe((response: any) => {
      this.categories = response.categories ?? [];
      this.cdr.detectChanges();
    });

    this.productService.getAllProducts().subscribe(
      (response: any) => {
        this.products = response.products;
        console.log('Fetched products:', this.products);
        this.loadingService.hide();

        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      () => {
        this.loadingService.hide();
        this.cdr.detectChanges();
      },
    );
  }

  activateProduct(productId: number) {
    this.loadingService.show();
    this.productService.activateProduct(productId).subscribe(
      () => {
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          product.status = 'active';
          product.isActive = true;
        }
        this.productService.clearCache();
        this.loadingService.hide();
        this.cdr.detectChanges();
      },
      () => {
        this.loadingService.hide();
        this.cdr.detectChanges();
      },
    );
  }

  deactivateProduct(productId: number) {
    this.loadingService.show();
    this.productService.deactivateProduct(productId).subscribe(
      () => {
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          product.status = 'rejected';
          product.isActive = false;
        }
        this.productService.clearCache();
        this.loadingService.hide();
        this.cdr.detectChanges();
      },
      () => {
        this.loadingService.hide();
        this.cdr.detectChanges();
      },
    );
  }

  promptDeleteProduct(product: Product) {
    this.deletingProductId = product.id;
    this.deletingProductName = product.name;
    this.isDeleteModalOpen = true;
    this.cdr.detectChanges();
  }

  cancelDeleteProduct() {
    this.isDeleteModalOpen = false;
    this.deletingProductId = null;
    this.deletingProductName = '';
    this.cdr.detectChanges();
  }

  deleteProduct() {
    if (this.deletingProductId === null) {
      return;
    }

    const productId = this.deletingProductId;
    this.isDeleting = true;
    this.loadingService.show();
    this.productService.deleteProduct(productId).subscribe(
      () => {
        this.products = this.products.filter((product) => product.id !== productId);
        if (this.page > this.totalPages) {
          this.page = this.totalPages;
        }
        this.productService.clearCache();
        this.isDeleting = false;
        this.loadingService.hide();
        this.cancelDeleteProduct();
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      },
      () => {
        this.isDeleting = false;
        this.loadingService.hide();
        this.cdr.detectChanges();
      },
    );
  }

  goToProductReviews(productId: number) {
    this.router.navigate(['/admin/products', productId, 'reviews']);
  }

  onCategoryChange() {
    this.page = 1;
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }
}
