import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role: 'customer' | 'seller' | 'admin';
}

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  forgotPassword(email: string) {
    return this.http.post(`${this.apiUrl}/auth/forgot-password`, { email });
  }

  resetPassword(token: string, password: string, confirmPassword: string) {
    return this.http.put(`${this.apiUrl}/auth/reset-password`, {
      token,
      password,
      confirmPassword,
    });
  }

  registerUser(user: RegisterPayload) {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  registerSeller(seller: RegisterPayload) {
    return this.http.post(`${this.apiUrl}/auth/register`, seller);
  }

  verifyEmail(email: string, code: string) {
    return this.http.post(`${this.apiUrl}/auth/verify-email`, { email, code });
  }

  // Get current user role (from backend)
  getCurrentUser() {
    // Question: What if the user messes with the token in localStorage?
    return this.http.get(`${this.apiUrl}/users/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
  }

  // Get cached user role
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // Set user role (call this after successful login)
  setUserRole(role: string) {
    localStorage.setItem('userRole', role);
  }
}
