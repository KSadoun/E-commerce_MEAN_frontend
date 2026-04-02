import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

import {
  COMPANY_DESCRIPTION,
  FOOTER_LINK_GROUPS,
  HIGHLIGHT_FEATURES,
  HOME_NAV_LINKS,
} from '../home/home.data';
import { AuthService } from '../../../core/services/auth.service';
import { HighlightsSection } from '../home/highlights-section';
import { HomeFooter } from '../home/home-footer';
import { HomeHeader } from '../home/home-header';
import { ProductsGridSection } from './products-grid-section';
import { CatalogProduct } from '../home/home.models';
import { HomeCatalogService } from '../../../services/user/home-catalog.service';

@Component({
  selector: 'app-shop',
  imports: [HomeHeader, ProductsGridSection, HighlightsSection, HomeFooter],
  templateUrl: './shop.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shop {
  private readonly authService = inject(AuthService);
  private readonly homeCatalogService = inject(HomeCatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly isAuthenticated = signal(this.authService.isAuthenticated());
  readonly products = signal<ReadonlyArray<CatalogProduct>>([]);
  readonly preselectedMaterial = signal<string | null>(null);

  readonly navLinks = HOME_NAV_LINKS;
  readonly materialOptions = computed(() =>
    Array.from(new Set(this.products().map((product) => product.material))).sort(),
  );
  readonly highlights = HIGHLIGHT_FEATURES;
  readonly footerLinks = FOOTER_LINK_GROUPS;
  readonly companyDescription = COMPANY_DESCRIPTION;

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.preselectedMaterial.set(params.get('material'));
    });

    this.homeCatalogService
      .getCatalogProducts()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (products) => this.products.set(products),
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