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

  private usersCache$: Observable<{ users: User[] }> | null = null;

  constructor(private http: HttpClient) {}

  getAllUser(): Observable<{ users: User[] }> {
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