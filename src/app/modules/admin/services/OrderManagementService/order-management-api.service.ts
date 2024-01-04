import { EOrderStatus } from './../../type/order-management.type';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderManagementApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) {}
  getOrders(): Observable<any> {
    return this.http.get(`${this.API_URL}/order`);
  }
  getOrdersThisMonth(): Observable<any> {
    return this.http.get(`${this.API_URL}/order/this-month`)
  }
  updateOrderStatus(id: string, status: EOrderStatus): Observable<any> {
    return this.http.put(`${this.API_URL}/order/${id}/status`, { status });
  }
}
