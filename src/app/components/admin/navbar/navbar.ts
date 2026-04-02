import { ChangeDetectionStrategy, Component, signal, effect, output } from '@angular/core';

@Component({
  selector: 'app-admin-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNavbar {
  readonly toggleMobileMenu = output<void>();
  readonly isDarkMode = signal(this.getInitialDarkMode());

  constructor() {
    effect(() => {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  private getInitialDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  onToggleMobileMenu(): void {
    this.toggleMobileMenu.emit();
  }

  toggleDarkMode(): void {
    this.isDarkMode.update(value => !value);
  }
}
