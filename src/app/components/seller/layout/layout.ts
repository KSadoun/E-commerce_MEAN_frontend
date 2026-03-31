import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SellerSidebar } from '../sidebar/sidebar';
import { SellerHeader } from '../header/header';

@Component({
  selector: 'app-seller-layout',
  imports: [RouterOutlet, SellerSidebar, SellerHeader],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerLayout {
  readonly sellerName = signal(localStorage.getItem('sellerName') ?? 'Seller Name');
  readonly sellerAvatar = signal(
    localStorage.getItem('sellerAvatar') ??
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
  );
  readonly collapsed = signal(false);
  readonly mobileMenuOpen = signal(false);

  toggleSidebar(): void {
    this.collapsed.update((value) => !value);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
