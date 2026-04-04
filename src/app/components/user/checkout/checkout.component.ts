import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../services/cart/cart.service';
import { PaymentService } from '../../../services/payment/payment.service';
import { CartItem } from '../../../models/cart';

interface SavedAddress {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  governorate: string;
  postalCode: string;
  country: string;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  // Shipping
  savedAddresses: SavedAddress[] = [];
  selectedAddressId: string | null = null;
  showNewAddressForm = false;
  saveThisAddress = true;
  addressLabel = '';

  firstName = '';
  lastName = '';
  street = '';
  city = '';
  governorate = '';
  postalCode = '';
  country = 'Egypt';

  // Payment
  paymentMethod = 'cod';

  // Wallet
  walletPhone = '';
  walletProcessing = false;
  walletSuccess = false;

  // Egyptian governorates for dropdown
  governorates = [
    'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Sharqia', 'Qalyubia',
    'Beheira', 'Gharbia', 'Monufia', 'Kafr El Sheikh', 'Damietta',
    'Port Said', 'Ismailia', 'Suez', 'Fayoum', 'Beni Suef', 'Minya',
    'Assiut', 'Sohag', 'Qena', 'Luxor', 'Aswan', 'Red Sea',
    'New Valley', 'Matrouh', 'North Sinai', 'South Sinai',
  ];

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadCart();
    this.loadSavedAddresses();
  }

  // ─── Cart ───────────────────────────────────────────────

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

  // ─── Saved Addresses ───────────────────────────────────

  loadSavedAddresses() {
    try {
      const raw = localStorage.getItem('savedAddresses');
      this.savedAddresses = raw ? JSON.parse(raw) : [];
    } catch {
      this.savedAddresses = [];
    }

    // Auto-select the first saved address if available
    if (this.savedAddresses.length > 0) {
      this.selectedAddressId = this.savedAddresses[0].id;
      this.showNewAddressForm = false;
    } else {
      this.showNewAddressForm = true;
    }
  }

  persistAddresses() {
    localStorage.setItem('savedAddresses', JSON.stringify(this.savedAddresses));
  }

  selectAddress(id: string) {
    this.selectedAddressId = id;
    this.showNewAddressForm = false;
  }

  startNewAddress() {
    this.selectedAddressId = null;
    this.showNewAddressForm = true;
    this.firstName = '';
    this.lastName = '';
    this.street = '';
    this.city = '';
    this.governorate = '';
    this.postalCode = '';
    this.addressLabel = '';
    this.saveThisAddress = true;
  }

  deleteAddress(id: string) {
    this.savedAddresses = this.savedAddresses.filter((a) => a.id !== id);
    this.persistAddresses();

    if (this.selectedAddressId === id) {
      if (this.savedAddresses.length > 0) {
        this.selectedAddressId = this.savedAddresses[0].id;
        this.showNewAddressForm = false;
      } else {
        this.selectedAddressId = null;
        this.showNewAddressForm = true;
      }
    }
  }

  getSelectedAddress(): SavedAddress | null {
    if (this.selectedAddressId) {
      return this.savedAddresses.find((a) => a.id === this.selectedAddressId) || null;
    }
    return null;
  }

  // ─── Shipping summary for review ───────────────────────

  getShippingDisplay(): { fullName: string; street: string; city: string; governorate: string; postalCode: string; country: string } {
    const saved = this.getSelectedAddress();
    if (saved) {
      return {
        fullName: `${saved.firstName} ${saved.lastName}`,
        street: saved.street,
        city: saved.city,
        governorate: saved.governorate,
        postalCode: saved.postalCode,
        country: saved.country,
      };
    }
    return {
      fullName: `${this.firstName} ${this.lastName}`,
      street: this.street,
      city: this.city,
      governorate: this.governorate,
      postalCode: this.postalCode,
      country: this.country,
    };
  }

  // ─── Validation ─────────────────────────────────────────

  isNewAddressValid(): boolean {
    return (
      this.firstName.trim() !== '' &&
      this.lastName.trim() !== '' &&
      this.street.trim() !== '' &&
      this.city.trim() !== '' &&
      this.governorate.trim() !== '' &&
      this.postalCode.trim() !== ''
    );
  }

  isShippingValid(): boolean {
    // Either a saved address is selected OR the new address form is valid
    if (this.selectedAddressId) return true;
    return this.showNewAddressForm && this.isNewAddressValid();
  }

  isWalletPhoneValid(): boolean {
    // Egyptian mobile: starts with 01, then 0/1/2/5, then 8 digits = 11 digits total
    const cleaned = this.walletPhone.replace(/\s/g, '');
    return /^01[0125]\d{8}$/.test(cleaned);
  }

  isPaymentValid(): boolean {
    if (this.paymentMethod === 'wallet') {
      return this.isWalletPhoneValid();
    }
    return true; // cod and card are always valid at this step
  }

  // ─── Step Navigation ────────────────────────────────────

  goToStep(stepNumber: number) {
    if (stepNumber === 2) {
      if (!this.isShippingValid()) return;

      // If new address, optionally save it
      if (this.showNewAddressForm && this.isNewAddressValid() && this.saveThisAddress) {
        const newAddr: SavedAddress = {
          id: crypto.randomUUID(),
          label: this.addressLabel.trim() || `${this.city} - ${this.street.substring(0, 20)}`,
          firstName: this.firstName,
          lastName: this.lastName,
          street: this.street,
          city: this.city,
          governorate: this.governorate,
          postalCode: this.postalCode,
          country: this.country,
        };
        this.savedAddresses.push(newAddr);
        this.persistAddresses();
        this.selectedAddressId = newAddr.id;
        this.showNewAddressForm = false;
      }
    }

    if (stepNumber === 3 && !this.isPaymentValid()) return;

    this.step = stepNumber;
    this.cdr.detectChanges();
  }

  // ─── Wallet Fake Payment ────────────────────────────────

 // ✅ UPDATED — Calls backend to actually mark order as paid
processWalletPayment(orderId: number) {
  this.walletProcessing = true;
  this.cdr.detectChanges();

  const formattedPhone = `+20${this.walletPhone.replace(/^0/, '')}`;

  // Fake delay (1.5–2.5s) THEN call backend
  const delay = 1500 + Math.random() * 1000;

  setTimeout(() => {
    this.paymentService.confirmWallet(orderId, formattedPhone).subscribe({
      next: () => {
        this.walletProcessing = false;
        this.walletSuccess = true;
        this.cdr.detectChanges();

        // Redirect after showing success
        setTimeout(() => {
          this.router.navigate(['/orders', orderId]);
        }, 1500);
      },
      error: (err) => {
        this.walletProcessing = false;
        this.submitting = false;
        this.error = err.error?.message || 'Wallet payment confirmation failed';
        this.cdr.detectChanges();
      },
    });
  }, delay);
}

  // ─── Place Order ────────────────────────────────────────

  placeOrder() {
    if (!this.isShippingValid()) return;
    if (!this.isPaymentValid()) return;

    this.submitting = true;
    this.error = '';
    this.cdr.detectChanges();

    const addr = this.getShippingDisplay();

    const checkoutData = {
      paymentMethod: this.paymentMethod === 'wallet' ? 'wallet' : this.paymentMethod,
      shippingAddress: {
        fullName: addr.fullName,
        street: addr.street,
        city: addr.city,
        governorate: addr.governorate,
        postalCode: addr.postalCode,
        country: addr.country,
      },
      ...(this.paymentMethod === 'wallet' ? { walletPhone: `+20${this.walletPhone.replace(/^0/, '')}` } : {}),
    };

    this.cartService.checkout(checkoutData).subscribe({
      next: (res: any) => {
        if (this.paymentMethod === 'cod') {
          // COD — go straight to order
          this.router.navigate(['/orders', res.order.id]);
          return;
        }

        if (this.paymentMethod === 'wallet') {
          // Wallet — fake processing then redirect
          this.processWalletPayment(res.order.id);
          return;
        }

        
this.paymentService.createIntent(res.order.id).subscribe({
  next: (paymentRes) => {
    const redirectUrl =
      paymentRes.sessionUrl ||
      paymentRes.sessionData?.sessionUrl ||
      paymentRes.sessionData?.response?.sessionUrl ||
      null;

    console.log('[Checkout] Kashier response:', paymentRes);
    console.log('[Checkout] Redirect URL:', redirectUrl);

    if (redirectUrl) {
      window.location.href = redirectUrl;
    } else {
      this.error = 'Failed to get payment session URL. Please try again.';
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