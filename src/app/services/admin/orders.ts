import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Order, OrderItem } from '../../models/order';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = environment.apiUrl;

  private orderItemsCache$: Observable<OrderItem[]> | null = null;

  constructor(private http: HttpClient) {}

  getAllOrderItems(): Observable<OrderItem[]> {
    if (!this.orderItemsCache$) {
      this.orderItemsCache$ = this.http
        .get<{ count: number; orders: Order[] }>(`${this.apiUrl}/orders`)
        .pipe(
          map(response => {
            // Flatten all items from all orders
            return response.orders.flatMap((order) =>
              order.items.map((item) => ({
                ...item,
                _orderId: order.id,
                _userId: order.userId,
                orderStatus: order.status,
                paymentStatus: order.paymentStatus,
              }))
            );
          }),
          shareReplay(1)
        );
    }
    return this.orderItemsCache$;
  }

  confirmCashOnDelivery(orderId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/orders/${orderId}/shipping`, {});
  }

  clearCache(): void {
    this.orderItemsCache$ = null;
  }
}
