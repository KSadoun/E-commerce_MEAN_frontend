import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
import { CatalogProduct, RealmCategory } from './home.models';
import { HeroSection } from './hero-section';
import { HighlightsSection } from './highlights-section';
import { HomeFooter } from './home-footer';
import { HomeHeader } from './home-header';
import { RealmsSection } from './realms-section';
import { TopProductsSection } from './top-products-section';
import { AuthService } from '../../../core/services/auth.service';
import { HomeCatalogService } from '../../../services/user/home-catalog.service';

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
  private readonly homeCatalogService = inject(HomeCatalogService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isAuthenticated = signal(this.authService.isAuthenticated());
  readonly categories = signal<ReadonlyArray<RealmCategory>>(HOME_CATEGORIES);
  readonly topProducts = signal<ReadonlyArray<CatalogProduct>>(TOP_PRODUCTS);

  readonly navLinks = HOME_NAV_LINKS;
  readonly highlights = HIGHLIGHT_FEATURES;
  readonly footerLinks = FOOTER_LINK_GROUPS;

  readonly heroHeadline = HERO_HEADLINE;
  readonly heroSubtitle = HERO_SUBTITLE;
  readonly heroImageUrl = HERO_IMAGE_URL;
  readonly companyDescription = COMPANY_DESCRIPTION;

  constructor() {
    this.homeCatalogService
      .getCategories(4)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => this.categories.set(categories),
      });

    this.homeCatalogService
      .getTopProducts(4)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => this.topProducts.set(products),
      });

    const updateAuthState = (): void => {
      this.isAuthenticated.set(this.authService.isAuthenticated());
    };

    window.addEventListener('storage', updateAuthState);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('storage', updateAuthState);
    });
  }
}
