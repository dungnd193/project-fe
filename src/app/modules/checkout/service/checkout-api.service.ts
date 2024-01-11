import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { IOrder } from '../type/checkout.type';

@Injectable({
  providedIn: 'root',
})
export class CheckoutApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) {}
  addOrder(order: IOrder): Observable<any> {
    return this.http.post(`${this.API_URL}/order`, order);
  }
}
