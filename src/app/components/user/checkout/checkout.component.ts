import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { PaymentService } from '../../../services/payment/payment.service';
import { CartItem } from '../../../models/cart';

@Component({
    selector: 'app-checkout',
    imports: [CommonModule, FormsModule],
    templateUrl: './checkout.html',
    styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
    step = 1;
    items: CartItem[] = [];
    subtotal = 0;
    discount = 0;
    tax = 0;
    shipping = 0;
    total = 0;
    currency = 'EGP';
    loading = true;
    submitting = false;
    error = '';

    firstName = '';
    lastName = '';
    street = '';
    city = '';
    governorate = '';
    postalCode = '';
    country = 'Egypt';

    paymentMethod = 'card';

    constructor(
        private cartService: CartService,
        private paymentService: PaymentService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadCart();
    }

    loadCart() {
        this.loading = true;
        this.cartService.getCart().subscribe({
            next: (res) => {
                this.items = res.items;
                this.subtotal = res.subtotal;
                this.discount = res.discount;
                this.tax = res.tax;
                this.shipping = res.shipping;
                this.total = res.total;
                this.currency = res.currency;
                this.loading = false;

                if (res.items.length === 0) {
                    this.router.navigate(['/cart']);
                }
            },
            error: () => {
                this.error = 'Failed to load cart';
                this.loading = false;
            },
        });
    }

    goToStep(stepNumber: number) {
        if (stepNumber === 2 && !this.isShippingValid()) return;
        this.step = stepNumber;
    }

    isShippingValid(): boolean {
        return (
            this.firstName.trim() !== '' &&
            this.lastName.trim() !== '' &&
            this.street.trim() !== '' &&
            this.city.trim() !== '' &&
            this.governorate.trim() !== '' &&
            this.postalCode.trim() !== ''
        );
    }

    placeOrder() {
        if (!this.isShippingValid()) return;
        this.submitting = true;
        this.error = '';

        const checkoutData = {
            paymentMethod: this.paymentMethod,
            shippingAddress: {
                street: this.street,
                city: this.city,
                governorate: this.governorate,
                postalCode: this.postalCode,
                country: this.country,
            },
        };

        this.cartService.checkout(checkoutData).subscribe({
            next: (res: any) => {
                if (this.paymentMethod === 'cod') {
                    this.router.navigate(['/orders', res.order.id]);
                    return;
                }

                this.paymentService.createIntent(res.order.id).subscribe({
                    next: (paymentRes) => {
                        if (paymentRes.sessionUrl) {
                            window.location.href = paymentRes.sessionUrl;
                        } else {
                            this.error = 'Failed to get payment session URL';
                            this.submitting = false;
                        }
                    },
                    error: (err) => {
                        this.error = err.error?.message || 'Payment session creation failed';
                        this.submitting = false;
                    },
                });
            },
            error: (err) => {
                this.error = err.error?.message || 'Checkout failed';
                this.submitting = false;
            },
        });
    }

    goBackToCart() {
        this.router.navigate(['/cart']);
    }
}