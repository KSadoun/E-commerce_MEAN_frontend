import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthApi } from '../../services/auth/auth-api';
import { CartService } from '../../services/cart/cart.service';                 
import { CartStateService } from '../../services/cart-state/cart-state.service'; 
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
    private cartService: CartService,       
    private cartState: CartStateService,    
  ) {}

  email: string = '';
  password: string = '';
  isSubmitting = false;
  errorMessage = '';

  onSubmit() {
    this.errorMessage = '';
    this.isSubmitting = true;

    this.authApi.login(this.email, this.password).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);

        this.handlePostLoginCart();

        const role = response.user.role;
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'customer') {
          this.router.navigate(['/']);
        } else if (role === 'seller') {
          this.router.navigate(['/seller']);
        } else {
          console.error('Unknown user role:', role);
          this.errorMessage = 'Login succeeded but the account role is not recognized.';
        }

        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Login failed:', error);
        if (error?.error?.requiresEmailVerification) {
          this.errorMessage =
            error?.error?.message || 'Please verify your email before logging in.';
          this.router.navigate(['/verify-email'], {
            queryParams: { email: error?.error?.email || this.email },
          });
        } else {
          this.errorMessage = error?.error?.message || 'Invalid email or password.';
        }
        this.isSubmitting = false;
      },
    });
  }

  private handlePostLoginCart(): void {
    localStorage.removeItem('guestId');

    this.cartService.getCart().subscribe({
      next: (res) => {
        console.log('User cart loaded after login:', res.items?.length ?? 0, 'items');
      },
      error: () => {
        this.cartState.clear();
      },
    });
  }
}