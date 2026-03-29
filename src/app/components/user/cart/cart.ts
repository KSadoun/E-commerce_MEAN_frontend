import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { CartItem } from '../../../models/cart';

@Component({
    selector: 'app-cart',
    imports: [CommonModule],
    templateUrl: './cart.html',
    styleUrl: './cart.css',
})
export class Cart implements OnInit {
    items: CartItem[] = [];
    subtotal = 0;
    discount = 0;
    tax = 0;
    shipping = 0;
    total = 0;
    currency = 'EGP';
    loading = true;
    error = '';

    constructor(private cartService: CartService, private router: Router) {}

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
            },
            error: (err) => {
                this.error = 'Failed to load cart';
                this.loading = false;
            },
        });
    }

    increaseQuantity(item: CartItem) {
        if (item.quantity >= item.availableStock) return;
        this.cartService.updateItemQuantity(item.productId, item.quantity + 1).subscribe({
            next: () => this.loadCart(),
            error: (err) => (this.error = err.error?.message || 'Failed to update quantity'),
        });
    }

    decreaseQuantity(item: CartItem) {
        if (item.quantity <= 1) return;
        this.cartService.updateItemQuantity(item.productId, item.quantity - 1).subscribe({
            next: () => this.loadCart(),
            error: (err) => (this.error = err.error?.message || 'Failed to update quantity'),
        });
    }

    removeItem(productId: number) {
        this.cartService.removeItem(productId).subscribe({
            next: () => this.loadCart(),
            error: (err) => (this.error = err.error?.message || 'Failed to remove item'),
        });
    }

    goToCheckout() {
        this.router.navigate(['/checkout']);
    }

    continueShopping() {
        this.router.navigate(['/users']);
    }
}