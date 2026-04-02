import { ChangeDetectionStrategy, Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebar } from "../sidebar/sidebar";
import { AdminNavbar } from "../navbar/navbar";
import { LoadingOverlayComponent } from '../../../shared/components/loading-overlay/loading-overlay';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminNavbar, AdminSidebar, LoadingOverlayComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout implements OnInit {
  readonly collapsed = signal(false);
  readonly mobileOpen = signal(false);

  ngOnInit(): void {
    // Restore dark mode from localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      const shell = document.querySelector('.admin-shell');
      if (shell) {
        shell.classList.add('dark');
      }
    }
  }

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
