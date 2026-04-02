import { ChangeDetectionStrategy, Component, signal, output } from '@angular/core';

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

  private getInitialDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }

  onToggleMobileMenu(): void {
    this.toggleMobileMenu.emit();
  }

  toggleDarkMode(): void {
    const newValue = !this.isDarkMode();
    this.isDarkMode.set(newValue);
    
    console.log('Dark mode toggled to:', newValue);
    
    // Apply to html element directly
    if (newValue) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      localStorage.setItem('darkMode', 'true');
      console.log('Added dark class');
      console.log('HTML classes:', document.documentElement.className);
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      localStorage.setItem('darkMode', 'false');
      console.log('Removed dark class');
      console.log('HTML classes:', document.documentElement.className);
    }
  }
}
