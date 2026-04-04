import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../models/product';
import { Review } from '../../models/review';
import { ProductService } from './products';
import { environment } from '../../../environments/environment.development';

export interface ProductReviewsResponse {
  product: Product | null;
  reviews: Review[];
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(
    private productService: ProductService,
    private http: HttpClient,
  ) {}

  getProductReviews(productId: number): Observable<ProductReviewsResponse> {
    return this.productService.getAllProducts().pipe(
      map(({ products }) => {
        const product = products.find((item) => item.id === productId) ?? null;

        return {
          product,
          reviews: product?.reviews ?? [],
        };
      }),
    );
  }

  deleteReview(reviewId: number): Observable<void> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.delete<void>(`${environment.apiUrl}/reviews/${reviewId}`, { headers });
  }

  clearProductCache(): void {
    this.productService.clearCache();
  }
}
