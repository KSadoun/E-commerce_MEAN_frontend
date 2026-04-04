import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/admin/users';
import { User, PaymentMethod } from '../../../models/user';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class UserDashboard implements OnInit {
  user: User | null = null;
  wishlist: any[] = [];
  orders: any[] = [];
  loading = true;

  // Profile edit state
  editingProfile = false;
  savingProfile = false;
  profileSaveError: string | null = null;
  profileDraft = { name: '', phone: '', email: '', address: '' };

  // Payment UI state
  showAddPayment = false;
  savingPayment = false;
  paymentSaveError: string | null = null;
  removingIndex: number | null = null;

  newPayment: PaymentMethod & { [key: string]: any } = {
    type: 'credit_card',
    cardHolder: '',
    last4: '',
    expiryMonth: '',
    expiryYear: '',
    brand: '',
    email: '',
  };

  constructor(private userService: UserService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.userService.getMyProfile().subscribe({
      next: (res: any) => {
        this.user = res;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load profile:', err),
    });

    this.userService.getMyWishlist().subscribe({
      next: (wishlist: any) => {
        this.wishlist = wishlist.items;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load wishlist:', err),
    });

    this.userService.getMyOrders().subscribe({
      next: (orders: any) => {
        this.orders = orders.orders;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  get paymentMethods(): PaymentMethod[] {
    return this.user?.paymentDetails ?? [];
  }

  openEditProfile() {
    this.profileDraft = {
      name: this.user?.name ?? '',
      phone: this.user?.phone ?? '',
      email: this.user?.email ?? '',
      address: this.user?.address ?? '',
    };
    this.profileSaveError = null;
    this.editingProfile = true;
  }

  cancelEditProfile() {
    this.editingProfile = false;
    this.profileSaveError = null;
  }

  saveProfile() {
    if (!this.user) return;
    this.savingProfile = true;
    this.profileSaveError = null;

    const payload: { name?: string; phone?: string; address?: string } = {};
    if (this.profileDraft.name.trim()) payload.name = this.profileDraft.name.trim();
    if (this.profileDraft.phone.trim()) payload.phone = this.profileDraft.phone.trim();
    payload.address = this.profileDraft.address.trim();

    this.userService.updateMyProfile(payload).subscribe({
      next: (res: any) => {
        this.user!.name = res.name ?? this.profileDraft.name;
        this.user!.phone = res.phone ?? this.profileDraft.phone;
        this.user!.email = res.email ?? this.user!.email;
        this.user!.address = res.address ?? this.profileDraft.address;
        this.savingProfile = false;
        this.editingProfile = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.profileSaveError = err?.error?.message ?? 'Failed to save. Please try again.';
        this.savingProfile = false;
        this.cdr.detectChanges();
      },
    });
  }

  openAddPayment() {
    this.newPayment = { type: 'credit_card', cardHolder: '', last4: '', expiryMonth: '', expiryYear: '', brand: '', email: '' };
    this.paymentSaveError = null;
    this.showAddPayment = true;
  }

  cancelAddPayment() {
    this.showAddPayment = false;
    this.paymentSaveError = null;
  }

  savePayment() {
    if (!this.user) return;
    this.savingPayment = true;
    this.paymentSaveError = null;

    const cleaned: PaymentMethod = { type: this.newPayment['type'] };
    if (this.newPayment['type'] === 'paypal') {
      cleaned.email = this.newPayment['email'];
    } else {
      cleaned.cardHolder = this.newPayment['cardHolder'];
      cleaned.last4 = this.newPayment['last4'];
      cleaned.expiryMonth = this.newPayment['expiryMonth'];
      cleaned.expiryYear = this.newPayment['expiryYear'];
      cleaned.brand = this.newPayment['brand'] || 'Visa';
    }

    const updated = [...this.paymentMethods, cleaned];

    this.userService.updateMyProfile({ paymentDetails: updated }).subscribe({
      next: (res: any) => {
        this.user!.paymentDetails = res.paymentDetails ?? updated;
        this.savingPayment = false;
        this.showAddPayment = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.paymentSaveError = err?.error?.message ?? 'Failed to save. Please try again.';
        this.savingPayment = false;
        this.cdr.detectChanges();
      },
    });
  }

  removePayment(index: number) {
    if (!this.user) return;
    this.removingIndex = index;

    const updated = this.paymentMethods.filter((_, i) => i !== index);

    this.userService.updateMyProfile({ paymentDetails: updated }).subscribe({
      next: (res: any) => {
        this.user!.paymentDetails = res.paymentDetails ?? updated;
        this.removingIndex = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to remove payment method:', err);
        this.removingIndex = null;
        this.cdr.detectChanges();
      },
    });
  }

  cardIcon(method: PaymentMethod): string {
    const brand = (method.brand ?? method.type ?? '').toLowerCase();
    if (brand.includes('visa')) return 'credit_score';
    if (brand.includes('master')) return 'credit_card';
    if (method.type === 'paypal') return 'account_balance_wallet';
    return 'credit_card';
  }

  cardLabel(method: PaymentMethod): string {
    if (method.type === 'paypal') return `PayPal · ${method.email}`;
    const brand = method.brand || (method.type === 'debit_card' ? 'Debit' : 'Card');
    return `${brand} •••• ${method.last4}`;
  }
}
