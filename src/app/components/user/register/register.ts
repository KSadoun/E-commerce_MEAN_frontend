import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthApi } from '../../../services/auth/auth-api';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class UserRegister {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  private readonly role: string = 'customer';
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private authApi: AuthApi, private router: Router) {}

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

    const user = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      confirmPassword: this.confirmPassword,
      role: this.role,
    };

    this.authApi.registerUser(user).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
        }
        this.successMessage = 'Verify Email Message Sent';
        this.isSubmitting = false;
        this.router.navigate(['/users/dashboard']);
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
        this.errorMessage = error?.error?.message || 'Registration failed. Please try again.';
        this.isSubmitting = false;
      },
    });
  }
}
