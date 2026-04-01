import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
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
})
export class Products implements OnInit {
  products: Product[] = [];
  isLoading = false;
  selectedCategory: string = '';

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

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

  deleteProduct(productId: number) {
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
