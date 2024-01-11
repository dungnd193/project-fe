import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyOrdersApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) {}
  getMyOrders(userId: string): Observable<any> {
    const params = new HttpParams().set('userId', userId) 
      
    return this.http.get(`${this.API_URL}/order/my-orders`, { params });
  }
}
