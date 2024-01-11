import { Injectable } from '@angular/core';
import { CartService } from 'app/modules/cart/service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { MyOrdersApiService } from './my-orders-api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyOrdersService {
  constructor(
    private toastr: ToastrService,
    private myOrdersApiService: MyOrdersApiService,
  ) { }
  private myOrdersBS = new BehaviorSubject<any[]>([]);

  get myOrdersBS$() {
    return this.myOrdersBS.asObservable();
  }


  getMyOrders(userId: string) {
    this.myOrdersApiService.getMyOrders(userId).subscribe(
      (data) => {
        this.myOrdersBS.next(data)
      },
      () => {}
    );
  }
}
