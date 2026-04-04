import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthApi } from '../../../services/auth/auth-api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-register',
  imports: [FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class SellerRegister {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  private readonly role: 'seller' = 'seller';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authApi: AuthApi,
    private router: Router,
  ) {}

  get passwordsMismatch(): boolean {
    return this.confirmPassword.length > 0 && this.password !== this.confirmPassword;
  }

  onSubmit() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.passwordsMismatch) {
      this.errorMessage = 'Password and confirm password must match.';
      return;
    }

    this.isSubmitting = true;

    const seller = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      confirmPassword: this.confirmPassword,
      role: this.role, // always 'seller'
    };
    this.authApi.registerSeller(seller).subscribe({
      next: (response: any) => {
        console.log('Seller registration successful:', response);
        this.successMessage = 'Verification code sent to your email.';
        this.isSubmitting = false;
        this.router.navigate(['/verify-email'], { queryParams: { email: this.email } });
      },
      error: (error: any) => {
        console.error('Seller registration failed:', error);
        this.errorMessage =
          error?.error?.message || 'Seller registration failed. Please try again.';
        this.isSubmitting = false;
      },
    });
  }
}
