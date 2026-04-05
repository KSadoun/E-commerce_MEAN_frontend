import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Product } from '../../models/product';

// remove after setting the API
// import { SAMPLE_PRODUCTS } from '../../data/sample-products';

import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsCache$: Observable<{ products: Product[] }> | null = null;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<{ products: Product[] }> {
    if (!this.productsCache$) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });
      // this.productsCache$ = of({ products: SAMPLE_PRODUCTS }).pipe(shareReplay(1));
      this.productsCache$ = this.http
        .get<{ products: Product[] }>(`${environment.apiUrl}/products?includeInactive=true`, {
          headers,
        })
        .pipe(shareReplay(1));
    }

    return this.productsCache$;
  }

  activateProduct(productId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.patch<void>(
      `${environment.apiUrl}/products/${productId}/activate`,
      {},
      { headers },
    );
  }

  deactivateProduct(productId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.patch<void>(
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
