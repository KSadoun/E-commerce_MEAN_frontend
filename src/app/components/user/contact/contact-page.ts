import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../core/services/auth.service';
import { HomeHeader } from '../home/home-header';
import { HomeFooter } from '../home/home-footer';
import { HOME_NAV_LINKS, FOOTER_LINK_GROUPS, COMPANY_DESCRIPTION } from '../home/home.data';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [HomeHeader, HomeFooter],
  templateUrl: './contact-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPage {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isAuthenticated = signal(this.authService.isAuthenticated());

  readonly navLinks = HOME_NAV_LINKS;
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

  onSubmit(event: Event) {
    event.preventDefault();
    console.log("Inquiry sent successfully!");
  }
}