import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export type OrderStatus = 'Pending' | 'Completed' | 'Shipped';

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

@Injectable({
  providedIn: 'root',
})
export class SalesService {
  getMetrics(): Observable<SalesMetric[]> {
    return of<SalesMetric[]>([
      { label: 'Total Revenue', value: 128450, currency: true },
      { label: 'Total Orders', value: 482 },
      { label: 'Total Products', value: 76 },
    ]).pipe(delay(160));
  }

  getOrders(): Observable<SalesOrder[]> {
    return of<SalesOrder[]>([
      {
        id: 'ORD-9041',
        customerName: 'Nora Adel',
        date: '2026-03-30',
        status: 'Completed',
        totalAmount: 420,
      },
      {
        id: 'ORD-9040',
        customerName: 'Yousef Ali',
        date: '2026-03-30',
        status: 'Shipped',
        totalAmount: 180,
      },
      {
        id: 'ORD-9039',
        customerName: 'Mona Sameh',
        date: '2026-03-29',
        status: 'Pending',
        totalAmount: 90,
      },
      {
        id: 'ORD-9038',
        customerName: 'Omar Magdy',
        date: '2026-03-29',
        status: 'Completed',
        totalAmount: 260,
      },
      {
        id: 'ORD-9037',
        customerName: 'Laila Tarek',
        date: '2026-03-28',
        status: 'Shipped',
        totalAmount: 330,
      },
      {
        id: 'ORD-9036',
        customerName: 'Karim Fawzy',
        date: '2026-03-27',
        status: 'Pending',
        totalAmount: 145,
      },
      {
        id: 'ORD-9035',
        customerName: 'Dina Ashraf',
        date: '2026-03-27',
        status: 'Completed',
        totalAmount: 275,
      },
    ]).pipe(delay(160));
  }
}
