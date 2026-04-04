import { Injectable, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';
import { CartResponse, CartSummary } from '../../models/cart';
import { CartStateService } from '../cart-state/cart-state.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(
    private http: HttpClient,
    @Optional() private cartState: CartStateService
  ) {}

  private updateCount(count: number): void {
    if (this.cartState) {
      this.cartState.setCount(count);
    }
  }

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.apiUrl).pipe(
      tap((res) => this.updateCount(res.count))
    );
  }

  addItem(productId: number | string, quantity: number = 1): Observable<any> {
    return this.http.post(this.apiUrl, {
      productId: Number(productId),
      quantity: Number(quantity),
    }).pipe(
      tap((res: any) => {
        if (res.items) this.updateCount(res.items.length);
      })
    );
  }

  updateItemQuantity(productId: number | string, quantity: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/items/${Number(productId)}`, {
      quantity: Number(quantity),
    }).pipe(
      tap((res: any) => {
        if (res.items) this.updateCount(res.items.length);
      })
    );
  }

  removeItem(productId: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${Number(productId)}`).pipe(
      tap((res: any) => {
        if (res.items) this.updateCount(res.items.length);
      })
    );
  }

  getSummary(): Observable<CartSummary> {
    return this.http.get<CartSummary>(`${this.apiUrl}/summary`).pipe(
      tap((res) => this.updateCount(res.itemCount))
    );
  }

  checkout(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, data).pipe(
      tap(() => this.updateCount(0))
    );
  }
}