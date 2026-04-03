import { Component, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/admin/products';
import { DeleteConfirmModalComponent } from '../../../../shared/components/delete-confirm-modal/delete-confirm-modal';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, HttpClientModule, DeleteConfirmModalComponent],
  templateUrl: './products.html',
  styleUrl: './products.css',
  providers: [],
})
export class Products implements OnInit {
  products: Product[] = [];
  isLoading = false;
  selectedCategory: string = '';
  isDeleteModalOpen = false;
  deletingProductId: number | null = null;
  deletingProductName = '';

  constructor(
    @Inject(ProductService) private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  get uniqueCategories(): string[] {
    const categories = this.products.map(product => product.categoryId.toString());
    return [...new Set(categories)].filter(cat => cat);
  }

  get filteredProducts(): Product[] {
    if (!this.selectedCategory) {
      return this.products;
    }
    return this.products.filter(product => product.categoryId.toString() === this.selectedCategory);
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

  ngOnInit() {
    this.productService.getAllProducts().subscribe((response: any) => {
      this.products = response.products;
      console.log('Fetched products:', this.products);
      
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    });
  }

  activateProduct(productId: number) {
    this.productService.activateProduct(productId).subscribe(() => {
      const product = this.products.find(p => p.id === productId);
      if (product) {
        product.isActive = true;
      }
      this.cdr.detectChanges();
    });
  }

  deactivateProduct(productId: number) {
    this.productService.deactivateProduct(productId).subscribe(() => {
      const product = this.products.find(p => p.id === productId);
      if (product) {
        product.isActive = false;
      }
      this.cdr.detectChanges();
    });
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
    this.isLoading = true;
    this.productService.deleteProduct(productId).subscribe(() => {
      this.products = this.products.filter(product => product.id !== productId);
      this.productService.clearCache();
      this.isLoading = false;
      this.cancelDeleteProduct();
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }, () => {
      this.isLoading = false;
      this.cdr.detectChanges();
    });
  }

  goToProductReviews(productId: number) {
    this.router.navigate(['/admin/products', productId, 'reviews']);
  }
}
