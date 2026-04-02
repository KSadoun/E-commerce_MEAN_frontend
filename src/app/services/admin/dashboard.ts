import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export interface DashboardStats {
  users: number;
  products: number;
  orders: number;
  categories: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  private dashboardCache$: Observable<DashboardStats> | null = null;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    if (!this.dashboardCache$) {

      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });
      this.dashboardCache$ = this.http.get<DashboardStats>(
        `${environment.apiUrl}/admin/dashboard`,
        { headers }
      ).pipe(shareReplay(1));
    }
    
    return this.dashboardCache$;
  }

  clearCache(): void {
    this.dashboardCache$ = null;
  }
}
