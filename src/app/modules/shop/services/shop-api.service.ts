import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { IGetProducts, IProduct } from '../type/shop.type';

@Injectable({
  providedIn: 'root',
})
export class ShopApiService {
  API_URL = environment.serverUrl;

  constructor(private http: HttpClient) {}
  getProducts({
    page,
    size,
    sort,
    orderBy,
    colorId,
    categoryId,
    name,
    start,
    end,
  }: IGetProducts): Observable<any> {
    return this.http.get(
      `${this.API_URL}/products?page=${page}&size=${size}${
        sort ? `&sort=${sort}` : ''
      }${orderBy ? `&orderBy=${orderBy}` : ''}${
        colorId ? `&colorId=${colorId}` : ''
      }${categoryId ? `&categoryId=${categoryId}` : ''}${
        name ? `&name=${name}` : ''
      }${start && end ? `&start=${start}&end=${end}` : ''}
      `
    );
  }
  getProductByPrice(start: number, end: number): Observable<any> {
    return this.http.get(
      `${this.API_URL}/products?page=1&size=6&orderBy=price&sort=ASC&start=${start}&end=${end}`
    );
  }

  uploadProductImage(files: FileList) {
    const formData = new FormData();
    Object.values(files).forEach((img) => {
      formData.append('image', img as any);
    });
    return this.http.post(`${this.API_URL}/products/upload`, formData);
  }

  createProduct(files: any) {
    const product = {
      title: 'product 1',
      description: 'product 1',
      code: '#P01',
      quantity: 10,
      brand: 'adidas',
      discount: '10%',
      viewCount: 333,
      status: 'INSTOCK',
      size: ['S', 'M', 'L'],
      price: 100000,
      nameUrlImage: [
        '1669101165010-989349649.jpg',
        '1669101165011-556504407.jpeg',
      ],
    };
    return this.http.post(`${this.API_URL}/products`, product);
  }
}
