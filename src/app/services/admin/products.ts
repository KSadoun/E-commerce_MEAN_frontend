import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Product } from '../../models/product';

// remove after setting the API
// import { SAMPLE_PRODUCTS } from '../../data/sample-products';

import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsCache$: Observable<{ products: Product[] }> | null = null;

  constructor(private http: HttpClient) {}

  getAllProducts(forceRefresh = false): Observable<{ products: Product[] }> {
    if (forceRefresh) {
      this.productsCache$ = null;
    }

    if (!this.productsCache$) {
      // this.productsCache$ = of({ products: SAMPLE_PRODUCTS }).pipe(shareReplay(1));
      this.productsCache$ = this.http
        .get<{
          products: Product[];
        }>(`${environment.apiUrl}/products?includeInactive=true&limit=100`)
        .pipe(shareReplay(1));
    }

    return this.productsCache$;
  }

  activateProduct(productId: number): Observable<{ product: Product }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.patch<{ product: Product }>(
      `${environment.apiUrl}/products/${productId}/activate`,
      {},
      { headers },
    );
  }

  deactivateProduct(productId: number): Observable<{ product: Product }> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.patch<{ product: Product }>(
      `${environment.apiUrl}/products/${productId}/deactivate`,
      {},
      { headers },
    );
  }

  deleteProduct(productId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete<void>(`${environment.apiUrl}/products/${productId}`, { headers });
  }

  clearCache(): void {
    this.productsCache$ = null;
  }
}
