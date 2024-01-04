import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { IAdminLogin } from '../../type/admin.type';

@Injectable({
  providedIn: 'root',
})
export class AdminApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) {}
  adminLogin(admin: IAdminLogin) {
    return this.http.post(`${this.API_URL}/auth/signin`, admin);
  }
}
