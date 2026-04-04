import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-seller-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerHeader {
  readonly sellerName = input.required<string>();
  readonly sellerAvatar = input.required<string>();
  readonly toggleMobileMenu = output<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onToggleMobileMenu(): void {
    this.toggleMobileMenu.emit();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
