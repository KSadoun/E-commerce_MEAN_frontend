import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate, CanActivateChild {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): Observable<boolean> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return of(false);
    }

    const cachedRole = this.authService.getUserRole();
    if (cachedRole === 'customer') {
      return of(true);
    }

    if (cachedRole) {
      this.router.navigate(['/']);
      return of(false);
    }

    return this.authService.getCurrentUser().pipe(
      map((response) => {
        if (response.role === 'customer') {
          this.authService.setUserRole('customer');
          return true;
        }

        this.router.navigate(['/']);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      }),
    );
  }

  canActivateChild(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot,
  ): Observable<boolean> {
    return this.canActivate();
  }
}
