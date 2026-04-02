import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthApi } from '../../services/auth/auth-api';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
})
export class ResetPassword {
  token = '';
  password = '';
  confirmPassword = '';

  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private authApi: AuthApi,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token') || '';
    });
  }

  get passwordsMismatch(): boolean {
    return this.confirmPassword.length > 0 && this.password !== this.confirmPassword;
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.token) {
      this.errorMessage = 'Missing reset token. Please use the link sent to your email.';
      return;
    }

    if (this.passwordsMismatch) {
      this.errorMessage = 'Password and confirm password must match.';
      return;
    }

    this.isSubmitting = true;

    this.authApi.resetPassword(this.token, this.password, this.confirmPassword).subscribe({
      next: () => {
        this.successMessage = 'Password reset successfully. Redirecting to login...';
        this.password = '';
        this.confirmPassword = '';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (error) => {
        this.errorMessage = error?.error?.message || 'Unable to reset password. Please try again.';
        this.isSubmitting = false;
      },
    });
  }
}
