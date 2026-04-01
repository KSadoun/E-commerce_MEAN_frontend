import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export type ProductStatus = 'Active' | 'Inactive';
export type ProductCategory = 'Electronics' | 'Fashion' | 'Home' | 'Beauty';

export interface Category {
  id: number;
  name: ProductCategory;
}

export interface SellerProduct {
  id: number;
  image: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock: number;
  description: string;
  status: ProductStatus;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly categories: Category[] = [
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Fashion' },
    { id: 3, name: 'Home' },
    { id: 4, name: 'Beauty' },
  ];

  private readonly productsSubject = new BehaviorSubject<SellerProduct[]>([
    {
      id: 1001,
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&q=80&auto=format&fit=crop',
      name: 'Smart Watch Pro',
      category: 'Electronics',
      price: 159,
      stock: 42,
      description: 'Fitness-focused smartwatch with heart rate and sleep tracking.',
      status: 'Active',
    },
    {
      id: 1002,
      image:
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=80&q=80&auto=format&fit=crop',
      name: 'Bluetooth Headphones',
      category: 'Electronics',
      price: 99,
      stock: 0,
      description: 'Wireless over-ear headphones with immersive sound profile.',
      status: 'Inactive',
    },
    {
      id: 1003,
      image:
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&q=80&auto=format&fit=crop',
      name: 'Running Shoes',
      category: 'Fashion',
      price: 79,
      stock: 74,
      description: 'Lightweight running shoes optimized for comfort and grip.',
      status: 'Active',
    },
    {
      id: 1004,
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&q=80&auto=format&fit=crop',
      name: 'Minimal T-Shirt',
      category: 'Fashion',
      price: 25,
      stock: 130,
      description: 'Breathable cotton t-shirt with a minimal everyday fit.',
      status: 'Active',
    },
    {
      id: 1005,
      image:
        'https://images.unsplash.com/photo-1616627452092-7d2b5f3b8907?w=80&q=80&auto=format&fit=crop',
      name: 'Ceramic Vase',
      category: 'Home',
      price: 39,
      stock: 19,
      description: 'Handcrafted ceramic vase for modern living room styling.',
      status: 'Active',
    },
    {
      id: 1006,
      image:
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=80&q=80&auto=format&fit=crop',
      name: 'Skincare Set',
      category: 'Beauty',
      price: 58,
      stock: 36,
      description: 'Hydration and glow essentials bundle for daily skincare.',
      status: 'Inactive',
    },
    {
      id: 1007,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&q=80&auto=format&fit=crop',
      name: 'Noise-Cancel Earbuds',
      category: 'Electronics',
      price: 119,
      stock: 51,
      description: 'Compact earbuds with active noise cancellation and deep bass.',
      status: 'Active',
    },
    {
      id: 1008,
      image:
        'https://images.unsplash.com/photo-1467043198406-dc953a3defa0?w=80&q=80&auto=format&fit=crop',
      name: 'Desk Lamp',
      category: 'Home',
      price: 44,
      stock: 25,
      description: 'Adjustable LED desk lamp with warm and cool light tones.',
      status: 'Active',
    },
    {
      id: 1009,
      image:
        'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=80&q=80&auto=format&fit=crop',
      name: 'Facial Cleanser',
      category: 'Beauty',
      price: 22,
      stock: 88,
      description: 'Gentle daily facial cleanser suitable for sensitive skin.',
      status: 'Active',
    },
    {
      id: 1010,
      image:
        'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=80&q=80&auto=format&fit=crop',
      name: 'Classic Backpack',
      category: 'Fashion',
      price: 49,
      stock: 15,
      description: 'Durable backpack designed for commuting and short trips.',
      status: 'Inactive',
    },
  ]);

  getProducts(): Observable<SellerProduct[]> {
    return this.productsSubject.asObservable();
  }

  getCategories(): Observable<Category[]> {
    return of(this.categories).pipe(delay(100));
  }

  addProduct(product: Omit<SellerProduct, 'id'>): Observable<SellerProduct> {
    const nextId =
      this.productsSubject.value.length > 0
        ? Math.max(...this.productsSubject.value.map((item) => item.id)) + 1
        : 1;

    const newProduct: SellerProduct = {
      ...product,
      id: nextId,
    };

    this.productsSubject.next([newProduct, ...this.productsSubject.value]);
    return of(newProduct).pipe(delay(120));
  }

  updateProduct(product: SellerProduct): Observable<SellerProduct> {
    const updated = this.productsSubject.value.map((item) =>
      item.id === product.id ? product : item,
    );
    this.productsSubject.next(updated);
    return of(product).pipe(delay(120));
  }

  deleteProduct(productId: number): Observable<number> {
    this.productsSubject.next(this.productsSubject.value.filter((item) => item.id !== productId));
    return of(productId).pipe(delay(120));
  }

  toggleProductStatus(productId: number): Observable<SellerProduct | undefined> {
    let toggledProduct: SellerProduct | undefined;
    const updated = this.productsSubject.value.map((item) => {
      if (item.id !== productId) {
        return item;
      }

      toggledProduct = {
        ...item,
        status: item.status === 'Active' ? 'Inactive' : 'Active',
      };
      return toggledProduct;
    });

    this.productsSubject.next(updated);
    return of(toggledProduct).pipe(delay(120));
  }
}
