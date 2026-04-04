import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

import { HomeNavLink } from './home.models';

@Component({
  selector: 'app-home-header',
  imports: [RouterLink],
  templateUrl: './home-header.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeHeader {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly navLinks = input.required<ReadonlyArray<HomeNavLink>>();
  readonly isAuthenticated = input<boolean>(false);
  readonly mobileMenuOpen = signal(false);

  get profileRoute(): string {
    const role = this.authService.getUserRole();
    if (role === 'seller') {
      return '/seller/profile';
    }

    if (role === 'admin') {
      return '/admin';
    }

    return '/users/dashboard';
  }

  logout(): void {
    this.mobileMenuOpen.set(false);
    this.authService.logout();
    // Keep existing storage listeners in page containers in sync immediately.
    window.dispatchEvent(new Event('storage'));
    this.router.navigate(['/login']);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((isOpen) => !isOpen);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
