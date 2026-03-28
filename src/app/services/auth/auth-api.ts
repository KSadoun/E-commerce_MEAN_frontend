import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthApi {
  private apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, password });
  }

  registerUser(user: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  registerSeller(seller: any) {
    return this.http.post(`${this.apiUrl}/auth/register`, seller);
  }

  // Get current user role (from backend)
  getCurrentUser() {
    // Question: What if the user messes with the token in localStorage?
    return this.http.get(`${this.apiUrl}/users/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
  }
}
