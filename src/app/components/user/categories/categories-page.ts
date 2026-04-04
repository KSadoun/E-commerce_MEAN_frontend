import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, computed } from '@angular/core';
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
  standalone: true,
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

  // --- Pagination Signals ---
  readonly currentPage = signal(1);
  readonly itemsPerPage = signal(3); // بناءً على طلبك: 3 في الصفحة

  // حساب الكاتيجوريز اللي هتظهر في الصفحة الحالية بس
  readonly visibleCategories = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    return this.categories().slice(startIndex, endIndex);
  });

  // حساب إجمالي عدد الصفحات
  readonly totalPages = computed(() => 
    Math.ceil(this.categories().length / this.itemsPerPage())
  );

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

  // فنكشن التنقل بين الصفحات
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}