import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

export interface SellerMetric {
  label: string;
  value: number;
  currency?: boolean;
}

export interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Paid' | 'Pending' | 'Shipped' | 'Cancelled';
}

interface SellerDashboardResponse {
  metrics: SellerMetric[];
  recentOrders: Array<{
    id: string;
    customer: string;
    date: string;
    total: number;
    status: 'Pending' | 'Shipped' | 'Completed' | 'Cancelled';
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class SellerDashboardService {
  private readonly apiUrl = environment.apiUrl;
  private dashboardCache$: Observable<SellerDashboardResponse> | null = null;

  constructor(private readonly http: HttpClient) {}

  private getDashboard(): Observable<SellerDashboardResponse> {
    if (!this.dashboardCache$) {
      this.dashboardCache$ = this.http
        .get<SellerDashboardResponse>(`${this.apiUrl}/seller/me/dashboard`)
        .pipe(shareReplay(1));
    }

    return this.dashboardCache$;
  }

  getMetrics(): Observable<SellerMetric[]> {
    return this.getDashboard().pipe(map((response) => response.metrics));
  }

  getRecentOrders(): Observable<RecentOrder[]> {
    return this.getDashboard().pipe(
      map((response) =>
        response.recentOrders.map((order) => ({
          ...order,
          status: order.status === 'Completed' ? 'Paid' : order.status,
        })),
      ),
    );
  }

  clearCache(): void {
    this.dashboardCache$ = null;
  }
}
