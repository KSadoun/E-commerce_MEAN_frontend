import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Order, OrderListResponse } from '../../models/order';

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    private apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }

    getOrders(): Observable<OrderListResponse> {
        return this.http.get<OrderListResponse>(this.apiUrl, { headers: this.getHeaders() });
    }

    getOrderById(id: number): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
    }

    cancelOrder(id: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${id}/cancel`, {}, { headers: this.getHeaders() });
    }
}