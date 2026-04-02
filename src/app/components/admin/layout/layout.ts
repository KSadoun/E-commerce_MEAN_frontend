import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from "../sidebar/sidebar";
import { AdminNavbar } from "../navbar/navbar";

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminNavbar, AdminSidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {
  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);

  toggleCollapse(): void {
    this.collapsed.update(value => !value);
  }

  toggleMobileMenu(): void {
    this.mobileOpen.update(value => !value);
  }

  closeMobileMenu(): void {
    this.mobileOpen.set(false);
  }
}
