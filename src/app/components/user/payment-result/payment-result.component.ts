import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/payment/payment.service';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.css',
})
export class PaymentResultComponent implements OnInit {
  loading = true;
  orderId: number | null = null;
  paymentStatus = '';
  orderStatus = '';
  error = '';
  retryCount = 0;
  maxRetries = 5;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.queryParams;
    console.log('[PaymentResult] Kashier redirect params:', params);

    this.orderId = this.extractOrderId(params);

    if (this.orderId) {
      // Check if Kashier already told us the status via query params
      const kashierStatus = (
        params['paymentStatus'] ||
        params['status'] ||
        params['transactionStatus'] ||
        ''
      ).toUpperCase();

      if (kashierStatus === 'SUCCESS' || kashierStatus === 'CAPTURED') {
        // Still verify with backend, but we have a hint
        this.checkStatus();
      } else if (kashierStatus === 'FAILURE' || kashierStatus === 'FAILED' || kashierStatus === 'DECLINED') {
        // Payment failed at Kashier level — still confirm with backend
        this.checkStatus();
      } else {
        // No status from Kashier — poll backend
        this.checkStatus();
      }
    } else {
      this.loading = false;
      this.error = 'No order ID found in redirect parameters';
    }
  }

  private extractOrderId(params: any): number | null {
    // Direct orderId param
    if (params['orderId']) {
      const direct = Number(params['orderId']);
      if (!isNaN(direct) && direct > 0) return direct;
    }

    // Kashier sends merchantOrderId as "ORDER-{id}-{timestamp}"
    const merchantOrderId =
      params['merchantOrderId'] ||
      params['merchant_order_id'] ||
      params['order'] ||
      params['order_id'];

    if (merchantOrderId) {
      // Try ORDER-{id}-{timestamp} pattern first
      const match = String(merchantOrderId).match(/^ORDER-(\d+)-/);
      if (match) {
        return Number(match[1]);
      }

      // Try splitting by dash
      const parts = String(merchantOrderId).split('-');
      if (parts.length >= 2) {
        const id = Number(parts[1]);
        if (!isNaN(id) && id > 0) return id;
      }

      // Try direct parse
      const parsed = Number(merchantOrderId);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }

    return null;
  }

  checkStatus() {
    if (!this.orderId) return;
    this.loading = true;
    this.error = '';

    this.paymentService.getPaymentStatus(this.orderId).subscribe({
      next: (res) => {
        this.paymentStatus = res.paymentStatus;
        this.orderStatus = res.status;

        // If still pending and we haven't retried too many times, poll again
        if (res.paymentStatus === 'pending' && this.retryCount < this.maxRetries) {
          this.retryCount++;
          setTimeout(() => this.checkStatus(), 3000);
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.error = 'Could not fetch payment status';
        this.loading = false;
      },
    });
  }

  goToOrder() {
    if (this.orderId) {
      this.router.navigate(['/orders', this.orderId]);
    }
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}