import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../../models/product';
import { Review } from '../../models/review';
import { ProductService } from './products';

export interface ProductReviewsResponse {
  product: Product | null;
  reviews: Review[];
}

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  constructor(private productService: ProductService) {}

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
}
