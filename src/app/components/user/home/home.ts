import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

import {
  COMPANY_DESCRIPTION,
  FOOTER_LINK_GROUPS,
  HERO_HEADLINE,
  HERO_IMAGE_URL,
  HERO_SUBTITLE,
  HIGHLIGHT_FEATURES,
  HOME_CATEGORIES,
  HOME_NAV_LINKS,
  TOP_PRODUCTS,
} from './home.data';
import { HeroSection } from './hero-section';
import { HighlightsSection } from './highlights-section';
import { HomeFooter } from './home-footer';
import { HomeHeader } from './home-header';
import { RealmsSection } from './realms-section';
import { TopProductsSection } from './top-products-section';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    HomeHeader,
    HeroSection,
    RealmsSection,
    TopProductsSection,
    HighlightsSection,
    HomeFooter,
  ],
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isAuthenticated = signal(this.authService.isAuthenticated());

  readonly navLinks = HOME_NAV_LINKS;
  readonly categories = HOME_CATEGORIES;
  readonly topProducts = TOP_PRODUCTS;
  readonly highlights = HIGHLIGHT_FEATURES;
  readonly footerLinks = FOOTER_LINK_GROUPS;

  readonly heroHeadline = HERO_HEADLINE;
  readonly heroSubtitle = HERO_SUBTITLE;
  readonly heroImageUrl = HERO_IMAGE_URL;
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
