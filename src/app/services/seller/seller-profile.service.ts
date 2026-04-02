import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface SellerProfileModel {
  id: number;
  userId: number;
  storeName: string;
  payoutMethod: string;
  isApproved: boolean;
}

interface SellerProfileUpdateResponse {
  message: string;
  profile: SellerProfileModel;
}

@Injectable({
  providedIn: 'root',
})
export class SellerProfileService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getProfile(): Observable<SellerProfileModel> {
    return this.http.get<SellerProfileModel>(`${this.apiUrl}/seller/me/profile`);
  }

  createProfile(payload: {
    storeName: string;
    payoutMethod: string;
  }): Observable<{ profile: SellerProfileModel }> {
    return this.http.post<{ profile: SellerProfileModel }>(
      `${this.apiUrl}/seller/me/profile`,
      payload,
    );
  }

  updateProfile(payload: {
    storeName?: string;
    payoutMethod?: string;
  }): Observable<SellerProfileUpdateResponse> {
    return this.http.patch<SellerProfileUpdateResponse>(
      `${this.apiUrl}/seller/me/profile`,
      payload,
    );
  }
}
