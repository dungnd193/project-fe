import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ICartProduct } from '../type/cart.type';

@Injectable({
  providedIn: 'root',
})
export class CartApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) {}
  getCartProducts(): Observable<any> {
    return this.http.get(`${this.API_URL}/cart`);
  }
  addProductToCart(product: ICartProduct): Observable<ICartProduct> {
    return this.http.post(`${this.API_URL}/cart`, product);
  }
  removeProduct(product: ICartProduct): Observable<ICartProduct> {
    return this.http.delete(`${this.API_URL}/cart/${product.id}`);
  }
  updateProduct(product: ICartProduct): Observable<ICartProduct> {
    return this.http.put(`${this.API_URL}/cart/${product.id}`, product);
  }
}
