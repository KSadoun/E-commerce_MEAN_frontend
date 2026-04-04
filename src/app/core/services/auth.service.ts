import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

type UserRole = 'admin' | 'customer' | 'seller';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpService = inject(HttpService);
  private readonly tokenKey = 'token';
  private readonly roleKey = 'userRole';

  login(email: string, password: string): Observable<{ token: string; user: { role: UserRole } }> {
    return this.httpService.post<{ token: string; user: { role: UserRole } }>('/auth/login', {
      email,
      password,
    });
  }

  getCurrentUser(): Observable<{ role: UserRole }> {
    return this.httpService.get<{ role: UserRole }>('/users/me');
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setUserRole(role: UserRole): void {
    localStorage.setItem(this.roleKey, role);
  }

  getUserRole(): UserRole | null {
    return localStorage.getItem(this.roleKey) as UserRole | null;
  }

  isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  logout(): void {
    this.clearToken();
    localStorage.removeItem(this.roleKey);
  }
}
