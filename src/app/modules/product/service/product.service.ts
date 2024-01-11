import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';
import { IProduct, IProductFeedback } from '../type/product.type';
import { ProductApiService } from './product-api.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  API_URL = environment.serverUrl;
  constructor(
    private productApiService: ProductApiService,
    private toastr: ToastrService
  ) { }
  private productBS = new BehaviorSubject<IProduct>({} as IProduct);
  private productFeedbackBS = new BehaviorSubject<any>([]);
  private reviewPermissionBS = new BehaviorSubject<Boolean>(false);
  get product$() {
    return this.productBS.asObservable();
  }
  get productFeedback$() {
    return this.productFeedbackBS.asObservable();
  }
  get reviewPermission$() {
    return this.reviewPermissionBS.asObservable();
  }
  getProduct(id: string) {
    this.productApiService
      .getProduct(id)
      .subscribe((data) => this.productBS.next(data));
  }

  requestPermissionReview(pid: { productId: string }) {
    this.productApiService.requestPermissionReview(pid).subscribe(data => {
      this.reviewPermissionBS.next(data.reviewPermission)
    })
  }

  getReviewByProductId(pId: string) {
    this.productApiService.getReviewByProductId(pId).subscribe((data) => {
      console.log(data)
      this.productFeedbackBS.next(data)
    })
  }

  saveReview(review: any) {
    this.productApiService.saveReview(review).subscribe(() => {
      this.toastr.success('Send review successfully!')
      this.getReviewByProductId(review.product_id)
    })
  }

}
