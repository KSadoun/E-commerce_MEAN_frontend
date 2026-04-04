import { Component, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/admin/products';
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
  isDeleting = false;
  selectedCategory: string = '';
  page = 1;
  readonly pageSize = 6;
  isDeleteModalOpen = false;
  deletingProductId: number | null = null;
  deletingProductName = '';

  get isLoading(): boolean {
    return this.loadingService.isLoading();
  }

  constructor(
    @Inject(ProductService) private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private loadingService: LoadingService,
  ) {}

  get uniqueCategories(): string[] {
    const categories = this.products.map((product) => product.categoryId.toString());
    return [...new Set(categories)].filter((cat) => cat);
  }

  get filteredProducts(): Product[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    return this.products.filter(
      (product) => product.categoryId.toString() === this.selectedCategory,
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredProducts.length / this.pageSize));
  }

  get paginatedProducts(): Product[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  getPrimaryImage(product: Product): string {
    return Array.isArray(product.image) && product.image.length > 0 ? product.image[0] : '';
  }

  ngOnInit() {
    this.loadingService.show();
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

  isProductActive(product: Product): boolean {
    if (product.status) {
      return product.status === 'active';
    }

    return Boolean(product.isActive);
  }

  productStatusLabel(product: Product): string {
    if (product.status === 'pending') {
      return 'Pending';
    }

    if (product.status === 'rejected') {
      return 'Rejected';
    }

    if (this.isProductActive(product)) {
      return 'Active';
    }

    return 'Rejected';
  }

  productImageCount(product: Product): number {
    const images = product.images || product.image || [];
    return Array.isArray(images) ? images.length : 0;
  }

  activateProduct(productId: number) {
    this.loadingService.show();
    this.productService.activateProduct(productId).subscribe(
      (response: any) => {
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          product.status = response?.product?.status || 'active';
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
      (response: any) => {
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          product.status = response?.product?.status || 'rejected';
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
