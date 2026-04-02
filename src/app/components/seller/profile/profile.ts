import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SellerProfileService } from '../../../services/seller/seller-profile.service';

@Component({
  selector: 'app-seller-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerProfile {
  storeName = '';
  payoutMethod = 'bank-transfer';
  isApproved = false;

  readonly loading = signal(true);
  readonly hasProfile = signal(true);
  readonly isSaving = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');

  constructor(private readonly sellerProfileService: SellerProfileService) {
    this.loadProfile();
  }

  private loadProfile(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.sellerProfileService.getProfile().subscribe({
      next: (profile) => {
        this.storeName = profile.storeName;
        this.payoutMethod = profile.payoutMethod;
        this.isApproved = profile.isApproved;
        this.hasProfile.set(true);
        this.loading.set(false);
      },
      error: (error) => {
        if (error?.status === 404) {
          this.hasProfile.set(false);
          this.loading.set(false);
          return;
        }

        this.errorMessage.set(error?.error?.message || 'Could not load seller profile.');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
    this.isSaving.set(true);

    const payload = {
      storeName: this.storeName,
      payoutMethod: this.payoutMethod,
    };

    const creatingProfile = !this.hasProfile();
    const request$ = this.hasProfile()
      ? this.sellerProfileService.updateProfile(payload)
      : this.sellerProfileService.createProfile(payload);

    request$.subscribe({
      next: (response: any) => {
        const profile = response?.profile;
        if (profile) {
          this.storeName = profile.storeName;
          this.payoutMethod = profile.payoutMethod;
          this.isApproved = profile.isApproved;
        }

        localStorage.setItem('sellerName', this.storeName);
        this.hasProfile.set(true);
        this.successMessage.set(
          creatingProfile
            ? 'Seller profile created successfully.'
            : 'Seller profile saved successfully.',
        );
        this.isSaving.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message || 'Could not save seller profile.');
        this.isSaving.set(false);
      },
    });
  }
}
