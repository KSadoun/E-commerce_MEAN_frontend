import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-seller-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerSidebar {
  readonly collapsed = input(false);
  readonly mobileOpen = input(false);
  readonly closeMobileMenu = output<void>();

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  navigateToAddProduct(): void {
    this.router.navigate(['/seller/inventory']);
    this.closeMobileMenu.emit();
  }

  handleMenuClick(): void {
    this.closeMobileMenu.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu.emit();
  }
}
