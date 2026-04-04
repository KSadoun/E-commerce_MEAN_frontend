import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { timeout } from 'rxjs';
import { AuthApi } from '../../services/auth/auth-api';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(
    private authApi: AuthApi,
    private router: Router,
  ) {}

  email: string = '';
  password: string = '';
  isSubmitting = false;
  errorMessage = '';
  pendingApprovalNotice = '';

  onSubmit() {
    if (this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.pendingApprovalNotice = '';

    if (!this.email.trim() || !this.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    this.isSubmitting = true;

    this.authApi
      .login(this.email, this.password)
      .pipe(timeout(8000))
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token);

          const role = response.user.role;
          localStorage.setItem('userRole', role);
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else if (role === 'customer') {
            this.router.navigate(['/']);
          } else if (role === 'seller') {
            this.router.navigate(['/seller']);
          } else {
            this.errorMessage = 'Login succeeded but the account role is not recognized.';
          }
        },
        error: (error) => {
          if (error?.name === 'TimeoutError') {
            this.errorMessage = 'Login request timed out. Please try again.';
            return;
          }

          if (error?.error?.requiresEmailVerification) {
            this.errorMessage =
              error?.error?.message || 'Please verify your email before logging in.';
            this.router.navigate(['/verify-email'], {
              queryParams: { email: error?.error?.email || this.email },
            });
          } else if (error?.error?.requiresAdminApproval) {
            this.pendingApprovalNotice =
              error?.error?.message ||
              'Your seller account is pending admin approval. You can log in after approval.';
          } else {
            this.errorMessage = error?.error?.message || 'Invalid email or password.';
          }
        },
      });
  }
}
