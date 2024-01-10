import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) {}
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.API_URL}/auth/userInfo`);
  }
  
  updateUserInfo(userInfo: any): Observable<any> {
    return this.http.patch(`${this.API_URL}/auth/updateUserInfo`, {
      ...userInfo
    });
  }

  uploadUserAvatar(formData: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}/upload/images/user`, formData);
  }
}
