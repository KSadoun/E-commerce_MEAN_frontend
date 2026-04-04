import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { PaymentService } from '../../../services/payment/payment.service';
import { CartItem } from '../../../models/cart';
import { HomeHeader } from '../home/home-header';
import { HomeFooter } from '../home/home-footer';
import { COMPANY_DESCRIPTION, FOOTER_LINK_GROUPS, HOME_NAV_LINKS } from '../home/home.data';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HomeHeader, HomeFooter],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
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

  readonly navLinks = HOME_NAV_LINKS;
  readonly footerLinks = FOOTER_LINK_GROUPS;
  readonly companyDescription = COMPANY_DESCRIPTION;

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

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
        this.cdr.detectChanges();

        if (res.items.length === 0) {
          this.router.navigate(['/cart']);
        }
      },
      error: () => {
        this.error = 'Failed to load cart';
        this.loading = false;
        this.cdr.detectChanges();
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
        fullName: `${this.firstName} ${this.lastName}`,
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
              this.cdr.detectChanges();
            }
          },
          error: (err) => {
            this.error = err.error?.message || 'Payment session creation failed';
            this.submitting = false;
            this.cdr.detectChanges();
          },
        });
      },
      error: (err) => {
        this.error = err.error?.message || 'Checkout failed';
        this.submitting = false;
        this.cdr.detectChanges();
      },
    });
  }

  goBackToCart() {
    this.router.navigate(['/cart']);
  }
}
