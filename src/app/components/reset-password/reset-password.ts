import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthApi } from '../../services/auth/auth-api';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  oldPassword = '';
  newPassword = '';
  confirmNewPassword = '';

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authApi: AuthApi) {}

  get passwordsMismatch(): boolean {
    return this.confirmNewPassword.length > 0 && this.newPassword !== this.confirmNewPassword;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.passwordsMismatch) {
      this.errorMessage = 'New password and confirm password must match.';
      return;
    }

    this.isSubmitting = true;

    this.authApi.resetPassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.successMessage = 'Password updated successfully.';
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmNewPassword = '';
        this.isSubmitting = false;
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to update password. Please try again.';
        this.isSubmitting = false;
      },
    });
  }
}
