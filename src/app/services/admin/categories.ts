import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Category } from '../../models/category';
import { Product } from '../../models/product';

// remove after setting the API
// import { SAMPLE_PRODUCTS } from '../../data/sample-products';

import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesCache$: Observable<{ categories: Category[] }> | null = null;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<{ categories: Category[] }> {
    if (!this.categoriesCache$) {
      this.categoriesCache$ = this.http
        .get<{ categories: Category[] }>(`${environment.apiUrl}/products/categories`)
        .pipe(shareReplay(1));
    }

    return this.categoriesCache$;
  }

  getCategoryProducts(categoryId: number): Observable<{ products: Product[] }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get<{ products: Product[] }>(
      `${environment.apiUrl}/products?categoryId=${categoryId}&includeInactive=true&limit=100`,
      { headers },
    );
    // const filteredProducts = SAMPLE_PRODUCTS.filter(p => p.categoryId === categoryId);
    // return of({ products: filteredProducts }).pipe(shareReplay(1));
  }

  restrictCategory(categoryId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.patch<void>(
      `${environment.apiUrl}/admin/categories/${categoryId}/restrict`,
      {},
      { headers },
    );
  }

  unrestrictCategory(categoryId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.patch<void>(
      `${environment.apiUrl}/admin/categories/${categoryId}/unrestrict`,
      {},
      { headers },
    );
  }

  clearCache(): void {
    this.categoriesCache$ = null;
  }
}
