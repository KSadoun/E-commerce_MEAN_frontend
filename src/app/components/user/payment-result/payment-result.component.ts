import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../services/payment/payment.service';
import { HomeHeader } from '../home/home-header';
import { HomeFooter } from '../home/home-footer';
import { COMPANY_DESCRIPTION, FOOTER_LINK_GROUPS, HOME_NAV_LINKS } from '../home/home.data';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule, HomeHeader, HomeFooter],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.css',
})
export class PaymentResultComponent implements OnInit {
  loading = true;
  orderId: number | null = null;
  paymentStatus = '';
  orderStatus = '';
  error = '';

  readonly navLinks = HOME_NAV_LINKS;
  readonly footerLinks = FOOTER_LINK_GROUPS;
  readonly companyDescription = COMPANY_DESCRIPTION;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private authService: AuthService,
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  ngOnInit() {
    const params = this.route.snapshot.queryParams;

    this.orderId = this.extractOrderId(params);

    if (this.orderId) {
      this.checkStatus();
    } else {
      this.loading = false;
      this.error = 'No order ID found in redirect parameters';
    }
  }

  private extractOrderId(params: any): number | null {
    if (params['orderId']) {
      return Number(params['orderId']);
    }

    const merchantOrderId =
      params['merchantOrderId'] ||
      params['merchant_order_id'] ||
      params['order'] ||
      params['order_id'];

    if (merchantOrderId) {
      const parts = String(merchantOrderId).split('-');
      if (parts.length >= 2) {
        const id = Number(parts[1]);
        if (!isNaN(id)) return id;
      }
      const parsed = Number(merchantOrderId);
      if (!isNaN(parsed)) return parsed;
    }

    return null;
  }

  checkStatus() {
    if (!this.orderId) return;
    this.loading = true;

    this.paymentService.getPaymentStatus(this.orderId).subscribe({
      next: (res) => {
        this.paymentStatus = res.paymentStatus;
        this.orderStatus = res.status;
        this.loading = false;
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
