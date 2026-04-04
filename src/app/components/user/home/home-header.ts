import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
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

  logout(): void {
    this.authService.logout();
    // Keep existing storage listeners in page containers in sync immediately.
    window.dispatchEvent(new Event('storage'));
    this.router.navigate(['/login']);
  }
}
