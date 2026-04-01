import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Product } from '../../models/product';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private productsCache$: Observable<{ products: Product[] }> | null = null;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<{ products: Product[] }> {
    if (!this.productsCache$) {
      this.productsCache$ = this.http.get<{ products: Product[] }>(`${environment.apiUrl}/products`)
        .pipe(shareReplay(1));
    }
    
    return this.productsCache$;
  }

  deleteProduct(productId: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete<void>(
      `${environment.apiUrl}/admin/products/${productId}`,
      { headers }
    );
  }

  clearCache(): void {
    this.productsCache$ = null;
  }
}
