import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  status: 'Paid' | 'Pending' | 'Shipped';
}

@Injectable({
  providedIn: 'root',
})
export class SellerDashboardService {
  getMetrics(): Observable<SellerMetric[]> {
    return of([
      { label: 'Total Revenue', value: 128450, currency: true },
      { label: 'Total Orders', value: 482 },
      { label: 'Total Products', value: 76 },
    ]).pipe(delay(150));
  }

  getRecentOrders(): Observable<RecentOrder[]> {
    return of<RecentOrder[]>([
      { id: 'ORD-9041', customer: 'Nora Adel', date: '2026-03-30', total: 420, status: 'Paid' },
      { id: 'ORD-9040', customer: 'Yousef Ali', date: '2026-03-30', total: 180, status: 'Shipped' },
      { id: 'ORD-9039', customer: 'Mona Sameh', date: '2026-03-29', total: 90, status: 'Pending' },
      { id: 'ORD-9038', customer: 'Omar Magdy', date: '2026-03-29', total: 260, status: 'Paid' },
    ]).pipe(delay(150));
  }
}
