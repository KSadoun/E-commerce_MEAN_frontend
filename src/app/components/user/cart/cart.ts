import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { CartItem } from '../../../models/cart';

@Component({
  selector: 'app-cart',
  standalone: true,
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

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef   
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.error = '';

    this.cartService.getCart().subscribe({
      next: (res) => {
        this.items = res.items || [];
        this.subtotal = res.subtotal ?? 0;
        this.discount = res.discount ?? 0;
        this.tax = res.tax ?? 0;
        this.shipping = res.shipping ?? 0;
        this.total = res.total ?? 0;
        this.currency = res.currency ?? 'EGP';
        this.loading = false;
        this.cdr.detectChanges();    
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load cart';
        this.loading = false;
        this.cdr.detectChanges();    
      },
    });
  }

  increaseQuantity(item: CartItem) {
    if (item.quantity >= item.availableStock) return;
    this.cartService.updateItemQuantity(item.productId, item.quantity + 1).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        this.error = err.error?.message || 'Failed to update quantity';
        this.cdr.detectChanges();
      },
    });
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity <= 1) return;
    this.cartService.updateItemQuantity(item.productId, item.quantity - 1).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        this.error = err.error?.message || 'Failed to update quantity';
        this.cdr.detectChanges();
      },
    });
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        this.error = err.error?.message || 'Failed to remove item';
        this.cdr.detectChanges();
      },
    });
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }

  continueShopping() {
    this.router.navigate(['/shop']);
  }
}