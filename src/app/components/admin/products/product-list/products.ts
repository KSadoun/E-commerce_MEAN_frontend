import { Component, ChangeDetectorRef, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../../../../models/product';
import { ProductService } from '../../../../services/admin/products';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
  providers: [],
})
export class Products implements OnInit {
  products: Product[] = [];
  isLoading = false;
  selectedCategory: string = '';

  constructor(@Inject(ProductService) private productService: ProductService, private cdr: ChangeDetectorRef) {}

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

  deleteProduct(productId: number) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    this.isLoading = true;
    this.productService.deleteProduct(productId).subscribe(() => {
      this.products = this.products.filter(product => product.id !== productId);
      this.productService.clearCache();
      this.isLoading = false;
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    });
  }
}
