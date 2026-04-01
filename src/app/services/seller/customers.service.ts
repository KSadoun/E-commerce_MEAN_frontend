import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface SellerCustomer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  getCustomers(): Observable<SellerCustomer[]> {
    return of<SellerCustomer[]>([
      {
        id: 'C-201',
        name: 'Nora Adel',
        email: 'nora.adel@example.com',
        totalOrders: 18,
        totalSpend: 2240,
        lastOrderDate: '2026-03-30',
      },
      {
        id: 'C-202',
        name: 'Yousef Ali',
        email: 'yousef.ali@example.com',
        totalOrders: 9,
        totalSpend: 980,
        lastOrderDate: '2026-03-30',
      },
      {
        id: 'C-203',
        name: 'Mona Sameh',
        email: 'mona.sameh@example.com',
        totalOrders: 6,
        totalSpend: 530,
        lastOrderDate: '2026-03-29',
      },
      {
        id: 'C-204',
        name: 'Omar Magdy',
        email: 'omar.magdy@example.com',
        totalOrders: 13,
        totalSpend: 1670,
        lastOrderDate: '2026-03-29',
      },
      {
        id: 'C-205',
        name: 'Laila Tarek',
        email: 'laila.tarek@example.com',
        totalOrders: 11,
        totalSpend: 1390,
        lastOrderDate: '2026-03-28',
      },
      {
        id: 'C-206',
        name: 'Karim Fawzy',
        email: 'karim.fawzy@example.com',
        totalOrders: 4,
        totalSpend: 320,
        lastOrderDate: '2026-03-27',
      },
      {
        id: 'C-207',
        name: 'Dina Ashraf',
        email: 'dina.ashraf@example.com',
        totalOrders: 15,
        totalSpend: 2110,
        lastOrderDate: '2026-03-27',
      },
    ]).pipe(delay(180));
  }
}
