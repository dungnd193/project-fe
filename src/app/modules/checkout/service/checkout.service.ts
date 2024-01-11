import { Injectable } from '@angular/core';
import { CartService } from 'app/modules/cart/service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { IOrder } from '../type/checkout.type';
import { CheckoutApiService } from './checkout-api.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(
    private toastr: ToastrService,
    private checkoutApiService: CheckoutApiService,
    private cartService: CartService
  ) {}
  public isOrderSuccess: boolean = false;
  addOrder(order: IOrder) {
    this.checkoutApiService.addOrder(order).subscribe(
      () => {
        localStorage.setItem('cartProducts', JSON.stringify([]));
        this.cartService.cartProducts = [];
        this.toastr.success('Order successfully!');
        this.isOrderSuccess = true;
      },
      () => {
        this.toastr.error('Order error!');
      }
    );
  }
}
