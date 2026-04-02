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

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private paymentService: PaymentService
    ) {}

    ngOnInit() {
        const params = this.route.snapshot.queryParams;
        this.orderId =
            Number(params['orderId']) ||
            Number(params['merchantOrderId']?.split('-')[1]) ||
            null;

        if (this.orderId) {
            this.checkStatus();
        } else {
            this.loading = false;
            this.error = 'No order ID found';
        }
    }

    checkStatus() {
        if (!this.orderId) return;

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
        this.router.navigate(['/users']);
    }
}