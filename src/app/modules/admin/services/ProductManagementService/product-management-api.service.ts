import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProduct } from 'app/modules/product/type/product.type';
import { IGetProducts } from 'app/modules/shop/type/shop.type';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import {
  ICategories,
  IColors,
  ISizes,
} from '../../type/product-management.type';

@Injectable({
  providedIn: 'root',
})
export class ProductManagementApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) {}
  getProductsWithOrdersSmall() {
    return this.http
      .get<any>(`${this.API_URL}/assets/showcase/data/products-orders.json`)
      .toPromise()
      .then((res) => <IProduct[]>res.data)
      .then((data) => {
        return data;
      });
  }
  getProducts({ page, size, sort }: IGetProducts): Observable<any> {
    return this.http.get(
      `${this.API_URL}/products?page=${page}&size=${size}&sort=${sort || 'ASC'}`
      // `${this.API_URL}/products`
    );
  }
  getProductDetail(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/products/${id}`);
  }
  saveProduct(product: IProduct) {
    return this.http.post(`${this.API_URL}/products`, product);
  }
  editProduct(product: IProduct) {
    return this.http.put(`${this.API_URL}/products/${product.id}`, product);
  }
  deleteProduct(id: string) {
    return this.http.delete(`${this.API_URL}/products/${id}`);
  }
  getCategories(): Observable<ICategories[]> {
    return this.http.get<ICategories[]>(`${this.API_URL}/categories`);
  }
  getSizes(): Observable<ISizes[]> {
    return this.http.get<ISizes[]>(`${this.API_URL}/size`);
  }
  getColors(): Observable<IColors[]> {
    return this.http.get<IColors[]>(`${this.API_URL}/color`);
  }

  uploadProductImage(files: FileList): Observable<{
    nameUrlImage: { fileName: string; originalName: string }[];
  }> {
    const formData = new FormData();
    Object.values(files).forEach((img) => {
      formData.append('image', img as any);
    });
    return this.http.post<{
      nameUrlImage: { fileName: string; originalName: string }[];
    }>(`${this.API_URL}/upload/images/product`, formData);
  }

  deleteProductImage(fileName: string) {
    return this.http.delete(`${this.API_URL}/upload/${fileName}`);
  }
}
