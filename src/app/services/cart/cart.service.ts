import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CartResponse, CartSummary } from '../../models/cart';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private apiUrl = `${environment.apiUrl}/cart`;

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
    }

    getCart(): Observable<CartResponse> {
        return this.http.get<CartResponse>(this.apiUrl, { headers: this.getHeaders() });
    }

    addItem(productId: number, quantity: number): Observable<any> {
        return this.http.post(this.apiUrl, { productId, quantity }, { headers: this.getHeaders() });
    }

    updateItemQuantity(productId: number, quantity: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/items/${productId}`, { quantity }, { headers: this.getHeaders() });
    }

    removeItem(productId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${productId}`, { headers: this.getHeaders() });
    }

    getSummary(): Observable<CartSummary> {
        return this.http.get<CartSummary>(`${this.apiUrl}/summary`, { headers: this.getHeaders() });
    }

    checkout(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/checkout`, data, { headers: this.getHeaders() });
    }
}