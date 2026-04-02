import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

export type OrderStatus = 'Pending' | 'Completed' | 'Shipped' | 'Cancelled';

export interface SalesMetric {
  label: string;
  value: number;
  currency?: boolean;
}

export interface SalesOrder {
  id: string;
  customerName: string;
  date: string;
  status: OrderStatus;
  totalAmount: number;
}

interface SellerSalesResponse {
  metrics: SalesMetric[];
  orders: SalesOrder[];
}

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  private readonly apiUrl = environment.apiUrl;
  private salesCache$: Observable<SellerSalesResponse> | null = null;

  constructor(private readonly http: HttpClient) {}

  private getSalesData(): Observable<SellerSalesResponse> {
    if (!this.salesCache$) {
      this.salesCache$ = this.http
        .get<SellerSalesResponse>(`${this.apiUrl}/seller/me/sales`)
        .pipe(shareReplay(1));
    }

    return this.salesCache$;
  }

  getMetrics(): Observable<SalesMetric[]> {
    return this.getSalesData().pipe(map((response) => response.metrics));
  }

  getOrders(): Observable<SalesOrder[]> {
    return this.getSalesData().pipe(map((response) => response.orders));
  }

  clearCache(): void {
    this.salesCache$ = null;
  }
}
