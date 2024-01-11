import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { IProductFeedback } from '../type/product.type';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) { }
  getProduct(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/products/${id}`);
  }
  getProductFeedback(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/api/feedbacks?prodId=${id}`);
  }
  saveProductFeedback(feedback: IProductFeedback): Observable<any> {
    return this.http.post(`${this.API_URL}/api/feedbacks`, feedback);
  }
  requestPermissionReview(pId: { productId: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/review/request`, pId)
  } 
  saveReview(review: any): Observable<any> {
    return this.http.post(`${this.API_URL}/review`, review)
  }

  getReviewByProductId(pId: string) {
    const params = new HttpParams().set('productId', pId) 

    return this.http.get(`${this.API_URL}/review`, { params });
  }
  // saveReview(review: IProductReview): Observable<any> {
  //   return this.http.post(`${this.API_URL}/review`, review);
  // }
}
