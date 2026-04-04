import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthApi } from '../../services/auth/auth-api';

@Component({
  selector: 'app-verify-email',
  imports: [FormsModule, RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail {
  email = '';
  code = '';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private readonly authApi: AuthApi,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.email = params.get('email') || this.email;
    });
  }

  onSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.email || !this.code) {
      this.errorMessage = 'Email and verification code are required.';
      return;
    }

    this.isSubmitting = true;

    this.authApi.verifyEmail(this.email, this.code).subscribe({
      next: () => {
        this.successMessage = 'Email verified successfully. You can now log in.';
        this.isSubmitting = false;
        setTimeout(() => this.router.navigate(['/login']), 800);
      },
      error: (error) => {
        this.errorMessage =
          error?.error?.message || 'Invalid or expired verification code. Please try again.';
        this.isSubmitting = false;
      },
    });
  }
}
