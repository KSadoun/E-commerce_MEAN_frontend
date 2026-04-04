import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

export interface SellerCustomer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderDate: string;
}

interface SellerCustomersResponse {
  count: number;
  customers: SellerCustomer[];
}

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getCustomers(): Observable<SellerCustomer[]> {
    return this.http
      .get<SellerCustomersResponse>(`${this.apiUrl}/seller/me/customers`)
      .pipe(map((response) => response.customers));
  }
}
