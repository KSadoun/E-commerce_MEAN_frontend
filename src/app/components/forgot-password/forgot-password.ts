import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthApi } from '../../services/auth/auth-api';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
})
export class ForgotPassword {
  email = '';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authApi: AuthApi) {}

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isSubmitting = true;

    this.authApi.forgotPassword(this.email).subscribe({
      next: () => {
        this.successMessage = 'Password reset email sent. Please check your inbox.';
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Could not send reset email. Try again.';
        this.isSubmitting = false;
      },
    });
  }
}
