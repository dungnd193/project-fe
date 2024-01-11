import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {
  ILoginRequest,
  ILoginResponse,
  IRegisterRequest,
} from '../type/authentication.type';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) {}

  logIn({ username, password }: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${this.API_URL}/auth/signin`, {
      username,
      password,
    });
  }

  register({
    username,
    password,
    email,
    phoneNumber,
  }: IRegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth/signup`, {
      username,
      password,
      email,
      phoneNumber,
    });
  }
}
