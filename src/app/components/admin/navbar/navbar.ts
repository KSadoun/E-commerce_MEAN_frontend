import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-admin-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminNavbar {
  readonly toggleMobileMenu = output<void>();

  onToggleMobileMenu(): void {
    this.toggleMobileMenu.emit();
  }
}
