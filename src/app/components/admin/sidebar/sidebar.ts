import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-sidebar',
  imports: [RouterLinkActive, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidebar {
  readonly collapsed = input(false);
  readonly mobileOpen = input(false);
  readonly closeMobileMenu = output<void>();
  readonly toggleCollapse = output<void>();

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  handleMenuClick(): void {
    this.closeMobileMenu.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMobileMenu.emit();
  }
}
