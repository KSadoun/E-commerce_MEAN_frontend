import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { HomeHeader } from '../home/home-header';
import { HomeFooter } from '../home/home-footer';
import { HOME_NAV_LINKS, FOOTER_LINK_GROUPS, COMPANY_DESCRIPTION } from '../home/home.data';
import { HomeCatalogService } from '../../../services/user/home-catalog.service';
import { RealmCategory } from '../home/home.models';

@Component({
  selector: 'app-categories-page',
  imports: [RouterLink, HomeHeader, HomeFooter],
  templateUrl: './categories-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage {
  private readonly authService = inject(AuthService);
  private readonly homeCatalogService = inject(HomeCatalogService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isAuthenticated = signal(this.authService.isAuthenticated());
  readonly categories = signal<ReadonlyArray<RealmCategory>>([]);
  readonly loading = signal(true);

  readonly navLinks = HOME_NAV_LINKS;
  readonly footerLinks = FOOTER_LINK_GROUPS;
  readonly companyDescription = COMPANY_DESCRIPTION;

  constructor() {
    this.homeCatalogService
      .getAllCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
          this.loading.set(false);
        },
        error: () => {
          this.categories.set([]);
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
