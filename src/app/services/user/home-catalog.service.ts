import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import {
  CatalogProduct,
  ProductDetails,
  ProductLabel,
  ProductReview,
  RealmCategory,
} from '../../components/user/home/home.models';

interface CategoryApi {
  id: number;
  name: string;
  itemCount?: number;
}

interface ProductApi {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  stock: number;
  status?: string;
  categoryId?: number;
  sellerId?: number;
  categoryName?: string;
  images?: string[];
  rating?: number | null;
  reviewCount?: number;
  reviews?: ProductReviewApi[];
  seller?: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    storeName?: string | null;
    isApproved?: boolean | null;
  } | null;
}

interface ProductReviewApi {
  id: number;
  productId: number;
  userId: number;
  userName?: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoriesResponse {
  categories: CategoryApi[];
}

interface TopProductsResponse {
  count?: number;
  products: ProductApi[];
}

interface CatalogProductsResponse {
  products: ProductApi[];
}

interface ProductReviewsResponse {
  count: number;
  reviews: ProductReviewApi[];
}

@Injectable({
  providedIn: 'root',
})
export class HomeCatalogService {
  private readonly apiUrl = environment.apiUrl;

  private readonly fallbackCategoryImages = [
    'https://images.unsplash.com/photo-1615529328331-f8917597711f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1616594039964-3cc4f0f3f3f8?auto=format&fit=crop&w=900&q=80',
  ];

  private readonly fallbackProductImages = [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1617104551722-3b2d5136641f?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=900&q=80',
  ];

  constructor(private readonly http: HttpClient) {}

  private mapReview(review: ProductReviewApi): ProductReview {
    return {
      id: Number(review.id),
      userId: Number(review.userId),
      userName: review.userName || 'Unknown',
      rating: Number(review.rating),
      comment: review.comment || '',
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }

  getCategories(limit = 4): Observable<RealmCategory[]> {
    return this.http.get<CategoriesResponse>(`${this.apiUrl}/products/categories`).pipe(
      map((response) =>
        response.categories
          .slice()
          .sort((a, b) => (b.itemCount ?? 0) - (a.itemCount ?? 0))
          .slice(0, limit)
          .map((category, index) => ({
            id: String(category.id),
            name: category.name,
            itemCount: category.itemCount ?? 0,
            imageUrl:
              this.fallbackCategoryImages[index % this.fallbackCategoryImages.length] ||
              this.fallbackCategoryImages[0],
          })),
      ),
    );
  }

  getAllCategories(): Observable<RealmCategory[]> {
    return this.http.get<CategoriesResponse>(`${this.apiUrl}/products/categories`).pipe(
      map((response) =>
        response.categories
          .slice()
          .sort((a, b) => (b.itemCount ?? 0) - (a.itemCount ?? 0))
          .map((category, index) => ({
            id: String(category.id),
            name: category.name,
            itemCount: category.itemCount ?? 0,
            imageUrl:
              this.fallbackCategoryImages[index % this.fallbackCategoryImages.length] ||
              this.fallbackCategoryImages[0],
          })),
      ),
    );
  }

  getTopProducts(limit = 4): Observable<CatalogProduct[]> {
    return this.http
      .get<TopProductsResponse>(
        `${this.apiUrl}/products/top?limit=${encodeURIComponent(String(limit))}`,
      )
      .pipe(
        map((response) =>
          (response.products || []).map((product, index) => ({
            id: String(product.id),
            backendId: product.id,
            title: product.name,
            category: product.categoryName || 'Featured',
            material: product.categoryName || 'Curated Selection',
            price: Number(product.price),
            stock: product.stock ?? 0,
            rating: product.rating ?? null,
            reviewCount: product.reviewCount ?? 0,
            imageUrl:
              product.images?.[0] ||
              this.fallbackProductImages[index % this.fallbackProductImages.length] ||
              this.fallbackProductImages[0],
            label: this.resolveLabel(product),
          })),
        ),
      );
  }

  getCatalogProducts(): Observable<CatalogProduct[]> {
    return this.http
      .get<CatalogProductsResponse>(`${this.apiUrl}/products?sort=name-asc&limit=100`)
      .pipe(
        map((response) =>
          response.products.map((product, index) => {
            const category = product.categoryName || 'General';
            return {
              id: String(product.id),
              backendId: product.id,
              title: product.name,
              category,
              material: category,
              price: Number(product.price),
              stock: product.stock ?? 0,
              rating: product.rating ?? null,
              reviewCount: product.reviewCount ?? 0,
              imageUrl:
                product.images?.[0] ||
                this.fallbackProductImages[index % this.fallbackProductImages.length] ||
                this.fallbackProductImages[0],
              label: this.resolveLabel(product),
            };
          }),
        ),
      );
  }

  getProductDetails(productId: number): Observable<ProductDetails> {
    return this.http.get<ProductApi>(`${this.apiUrl}/products/${productId}`).pipe(
      map((product) => {
        const fallbackImage =
          this.fallbackProductImages[productId % this.fallbackProductImages.length] ||
          this.fallbackProductImages[0];
        const images =
          Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : [fallbackImage];

        return {
          id: product.id,
          title: product.name,
          description: product.description || 'No description available.',
          category: product.categoryName || 'General',
          price: Number(product.price),
          currency: product.currency || 'USD',
          stock: Number(product.stock ?? 0),
          status: product.status || 'active',
          images,
          rating: product.rating ?? null,
          reviewCount: product.reviewCount ?? (product.reviews?.length || 0),
          reviews: (product.reviews || []).map((review) => this.mapReview(review)),
          seller: product.seller || null,
        };
      }),
    );
  }

  getProductReviews(productId: number): Observable<ProductReview[]> {
    return this.http
      .get<ProductReviewsResponse>(`${this.apiUrl}/products/${productId}/reviews`)
      .pipe(map((response) => (response.reviews || []).map((review) => this.mapReview(review))));
  }

  createProductReview(
    productId: number,
    payload: { rating: number; comment: string },
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/${productId}/reviews`, payload);
  }

  updateProductReview(
    productId: number,
    reviewId: number,
    payload: { rating?: number; comment?: string },
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/products/${productId}/reviews/${reviewId}`, payload);
  }

  deleteProductReview(productId: number, reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/${productId}/reviews/${reviewId}`);
  }

  private resolveLabel(product: ProductApi): ProductLabel | undefined {
    if (product.stock <= 5) {
      return 'Limited Stock';
    }
    if ((product.rating ?? 0) >= 4.5) {
      return 'Staff Pick';
    }
    if (product.price >= 1000) {
      return 'Premium';
    }
    return undefined;
  }
}
