import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { User } from '../../models/user';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  private usersCache$: Observable<{ users: User[] }> | null = null;

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

//   restrictUser(userId: number, isActive: boolean) {
//     return this.http.patch(`${this.apiUrl}/admin/users/${userId}/restrict`, { isActive });
//   }

//   softDeleteUser(userId: number) {
//     return this.http.delete(`${this.apiUrl}/admin/users/${userId}`);
//   }

  getAllUsers(): Observable<{ users: User[] }> {
    if (!this.usersCache$) {
      this.usersCache$ = this.http.get<{ users: User[] }>(`${environment.apiUrl}/users/all`)
        .pipe(shareReplay(1));
    }
    
    return this.usersCache$;
  }

  restrictUser(userId: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.patch<void>(
      `${environment.apiUrl}/admin/users/${userId}/restrict`, 
      {}, 
      { headers }
    );
  }

  unrestrictUser(userId: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.patch<void>(
      `${environment.apiUrl}/admin/users/${userId}/unrestrict`, 
      {}, 
      { headers }
    );
  }

  deleteUser(userId: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.delete<void>(
      `${environment.apiUrl}/admin/users/${userId}`,
      { headers }
    );
  }

  clearCache(): void {
    this.usersCache$ = null;
  }
}
