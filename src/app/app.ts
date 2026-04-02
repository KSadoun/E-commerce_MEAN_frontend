import { Component, signal, OnInit, ChangeDetectorRef  } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AuthApi } from "./services/auth/auth-api";
import { UserNavbar } from "./components/user/user-navbar/user-navbar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('ecommerce');
  userRole: string | null = null;

  constructor(private authApi: AuthApi, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadUserRole();
  }

  loadUserRole() {
    this.authApi.getCurrentUser().subscribe({
      next: (response: any) => {
        console.log('User role:', response.role);
        this.userRole = response.role;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Error fetching user role:', error);
        this.userRole = null;
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }
}
