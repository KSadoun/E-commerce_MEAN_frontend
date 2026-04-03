import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  COMPANY_DESCRIPTION,
  FOOTER_LINK_GROUPS,
  HIGHLIGHT_FEATURES,
  HOME_NAV_LINKS,
} from '../home/home.data';
import { CatalogProduct } from '../home/home.models';
import { AuthService } from '../../../core/services/auth.service';
import { HomeCatalogService } from '../../../services/user/home-catalog.service';
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
  private readonly catalogService = inject(HomeCatalogService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isAuthenticated = signal(this.authService.isAuthenticated());

  readonly products = signal<ReadonlyArray<CatalogProduct>>([]);
  readonly loading = signal(true);

  readonly materialOptions = computed(() => {
    const materials = new Set(this.products().map((p) => p.material));
    return [...materials].sort();
  });

  readonly navLinks = HOME_NAV_LINKS;
  readonly highlights = HIGHLIGHT_FEATURES;
  readonly footerLinks = FOOTER_LINK_GROUPS;
  readonly companyDescription = COMPANY_DESCRIPTION;

  constructor() {
    this.catalogService
      .getCatalogProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => {
          this.products.set(products);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
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