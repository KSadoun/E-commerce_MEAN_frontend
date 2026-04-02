import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { PaymentMethod, PaymentIntentResponse, PaymentStatus } from '../../models/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getMethods(): Observable<{ methods: PaymentMethod[] }> {
    return this.http.get<{ methods: PaymentMethod[] }>(`${this.apiUrl}/methods`);
  }

  createIntent(orderId: number): Observable<PaymentIntentResponse> {
    return this.http.post<PaymentIntentResponse>(`${this.apiUrl}/intent`, { orderId });
  }

  getPaymentStatus(orderId: number): Observable<PaymentStatus> {
    return this.http.get<PaymentStatus>(`${this.apiUrl}/status/${orderId}`);
  }
}