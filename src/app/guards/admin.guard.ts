import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthApi } from '../services/auth/auth-api';
import { map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authApi: AuthApi, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    // Check if user is admin by calling the backend API
    return this.authApi.getCurrentUser().pipe(
      map((response: any) => {
        if (response.role === 'admin') {
          return true;
        }
        // Not admin, redirect
        this.router.navigate(['/login']);
        return false;
      }),
      catchError(() => {
        // API error or user not authenticated, redirect to login
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}
