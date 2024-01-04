import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { IGetOrderInRangeTime, IImportedProductInRangeTime } from '../../type/admin.type';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) {}
  getOrderInRangeTime({startDate, endDate, productId}: IGetOrderInRangeTime) {
    const params = new HttpParams()
      .set('startDate', startDate.toString()) 
      .set('endDate', endDate.toString())
      .set('productId', productId || ""); 

    return this.http.get(`${this.API_URL}/order/rangeTime`, { params });
  }
  getImportedProductInRangeTime({startDate, endDate, productId, flag}: IImportedProductInRangeTime) {
    const params = new HttpParams()
      .set('startDate', startDate.toString()) 
      .set('endDate', endDate.toString())
      .set('productId', productId || "")
      .set('flag', flag || 0); 

    return this.http.get(`${this.API_URL}/storage/rangeTime`, { params });
  }
  getImportedProductInMonth({startDate, endDate, productId, flag}: IImportedProductInRangeTime) {
    const params = new HttpParams()
      .set('startDate', startDate.toString()) 
      .set('endDate', endDate.toString())
      .set('productId', productId || "")
      .set('flag', flag || 1); 

    return this.http.get(`${this.API_URL}/storage/rangeTime`, { params });
  }
}
