import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import {
  CATALOG_PRODUCTS,
  COMPANY_DESCRIPTION,
  FOOTER_LINK_GROUPS,
  HIGHLIGHT_FEATURES,
  HOME_NAV_LINKS,
  MATERIAL_OPTIONS,
} from '../home/home.data';
import { AuthService } from '../../../core/services/auth.service';
import { HighlightsSection } from '../home/highlights-section';
import { HomeFooter } from '../home/home-footer';
import { HomeHeader } from '../home/home-header';
import { ProductsGridSection } from './products-grid-section';

@Component({
  selector: 'app-shop',
  imports: [HomeHeader, ProductsGridSection, HighlightsSection, HomeFooter],
  templateUrl: './shop.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shop {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isAuthenticated = signal(this.authService.isAuthenticated());

  readonly navLinks = HOME_NAV_LINKS;
  readonly products = CATALOG_PRODUCTS;
  readonly materialOptions = MATERIAL_OPTIONS;
  readonly highlights = HIGHLIGHT_FEATURES;
  readonly footerLinks = FOOTER_LINK_GROUPS;
  readonly companyDescription = COMPANY_DESCRIPTION;

  constructor() {
    const updateAuthState = (): void => {
      this.isAuthenticated.set(this.authService.isAuthenticated());
    };

    window.addEventListener('storage', updateAuthState);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('storage', updateAuthState);
    });
  }
}
