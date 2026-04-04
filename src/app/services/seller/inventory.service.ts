import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

export type ProductStatus = 'Active' | 'Inactive';

export interface Category {
  id: number;
  name: string;
  itemCount?: number;
}

export interface SellerProduct {
  id: number;
  image: string;
  images: string[];
  name: string;
  category: string;
  categoryId: number;
  price: number;
  stock: number;
  description: string;
  status: ProductStatus;
}

interface BackendCategory {
  id: number;
  name: string;
  itemCount?: number;
}

interface BackendProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  images?: string[];
  isActive?: boolean;
}

interface CategoriesResponse {
  categories: BackendCategory[];
}

interface SellerProductsResponse {
  products: BackendProduct[];
}

interface SellerProductResponse {
  product: BackendProduct;
}

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly apiUrl = environment.apiUrl;
  private readonly fallbackImage =
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80';

  private readonly productsSubject = new BehaviorSubject<SellerProduct[]>([]);
  private readonly categoriesSubject = new BehaviorSubject<Category[]>([]);
  private isLoaded = false;
  private isLoading = false;

  constructor(private readonly http: HttpClient) {}

  private mapCategory(category: BackendCategory): Category {
    return {
      id: category.id,
      name: category.name,
      itemCount: category.itemCount,
    };
  }

  private mapProduct(product: BackendProduct): SellerProduct {
    const category = this.categoriesSubject.value.find((entry) => entry.id === product.categoryId);
    const images = Array.isArray(product.images) ? product.images : [];

    return {
      id: product.id,
      image: images[0] || this.fallbackImage,
      images,
      name: product.name,
      category: category?.name || 'Uncategorized',
      categoryId: product.categoryId,
      price: Number(product.price),
      stock: Number(product.stock),
      description: product.description || '',
      status: product.isActive === false ? 'Inactive' : 'Active',
    };
  }

  private ensureLoaded(): void {
    if (this.isLoaded || this.isLoading) {
      return;
    }

    this.isLoading = true;

    forkJoin({
      categoriesResponse: this.http.get<CategoriesResponse>(`${this.apiUrl}/products/categories`),
      productsResponse: this.http.get<SellerProductsResponse>(`${this.apiUrl}/seller/me/products`),
    })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe({
        next: ({ categoriesResponse, productsResponse }) => {
          const categories = categoriesResponse.categories.map((category) =>
            this.mapCategory(category),
          );
          this.categoriesSubject.next(categories);

          const products = productsResponse.products.map((product) => this.mapProduct(product));
          this.productsSubject.next(products);

          this.isLoaded = true;
        },
        error: () => {
          this.isLoaded = false;
        },
      });
  }

  getProducts(): Observable<SellerProduct[]> {
    this.ensureLoaded();
    return this.productsSubject.asObservable();
  }

  getCategories(): Observable<Category[]> {
    this.ensureLoaded();
    return this.categoriesSubject.asObservable();
  }

  addProduct(product: Omit<SellerProduct, 'id'>): Observable<SellerProduct> {
    const body = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      images: product.images.length > 0 ? product.images : product.image ? [product.image] : [],
    };

    return this.http.post<SellerProductResponse>(`${this.apiUrl}/seller/me/products`, body).pipe(
      map((response) => this.mapProduct(response.product)),
      tap((createdProduct) => {
        this.productsSubject.next([createdProduct, ...this.productsSubject.value]);
      }),
    );
  }

  updateProduct(product: SellerProduct): Observable<SellerProduct> {
    const body = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      isActive: product.status === 'Active',
      images: product.images.length > 0 ? product.images : product.image ? [product.image] : [],
    };

    return this.http
      .patch<SellerProductResponse>(`${this.apiUrl}/seller/me/products/${product.id}`, body)
      .pipe(
        map((response) => this.mapProduct(response.product)),
        tap((updatedProduct) => {
          const updatedList = this.productsSubject.value.map((item) =>
            item.id === updatedProduct.id ? updatedProduct : item,
          );
          this.productsSubject.next(updatedList);
        }),
      );
  }

  deleteProduct(productId: number): Observable<number> {
    return this.http.delete<void>(`${this.apiUrl}/seller/me/products/${productId}`).pipe(
      map(() => productId),
      tap(() => {
        this.productsSubject.next(
          this.productsSubject.value.filter((item) => item.id !== productId),
        );
      }),
    );
  }

  toggleProductStatus(productId: number): Observable<SellerProduct | undefined> {
    const current = this.productsSubject.value.find((item) => item.id === productId);
    if (!current) {
      return of(undefined);
    }

    const nextIsActive = current.status !== 'Active';

    return this.http
      .patch<SellerProductResponse>(`${this.apiUrl}/seller/me/products/${productId}/status`, {
        isActive: nextIsActive,
      })
      .pipe(
        map((response) => this.mapProduct(response.product)),
        tap((toggledProduct) => {
          const updatedList = this.productsSubject.value.map((item) =>
            item.id === toggledProduct.id ? toggledProduct : item,
          );
          this.productsSubject.next(updatedList);
        }),
      );
  }
}
