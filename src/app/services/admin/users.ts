import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/users/all`);
  }

  getUserRoles() {
    return this.http.get<string[]>(`${this.apiUrl}/users/roles`);
  }

  getMyProfile() {
    return this.http.get<User>(`${this.apiUrl}/users/me`);
  }

  updateMyProfile(data: {
    name?: string;
    address?: string;
    phone?: string;
    paymentDetails?: { type: string; last4: string }[];
  }) {
    return this.http.patch<User>(`${this.apiUrl}/users/me`, data);
  }

  addToWishlist(productId: number) {
    return this.http.post(`${this.apiUrl}/users/me/wishlist/${productId}`, {});
  }

  getMyWishlist() {
    return this.http.get(`${this.apiUrl}/users/me/wishlist`);
  }

  getMyFavorites() {
    return this.http.get(`${this.apiUrl}/users/me/favorites`);
  }

  removeFromWishlist(productId: number) {
    return this.http.delete(`${this.apiUrl}/users/me/wishlist/${productId}`);
  }

  getMyOrders() {
    return this.http.get(`${this.apiUrl}/users/me/orders`);
  }

  getMyReviews() {
    return this.http.get(`${this.apiUrl}/users/me/reviews`);
  }

  getAdminUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }

  restrictUser(userId: number, isActive: boolean) {
    return this.http.patch(`${this.apiUrl}/admin/users/${userId}/restrict`, { isActive });
  }

  softDeleteUser(userId: number) {
    return this.http.delete(`${this.apiUrl}/admin/users/${userId}`);
  }
}
