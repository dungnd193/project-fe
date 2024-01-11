import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../cart/service/cart.service';
import { ICartProduct } from '../cart/type/cart.type';
import { CheckoutService } from './service/checkout.service';
import { UserService } from '../user/service/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  constructor(
    public checkoutService: CheckoutService,
    private cartService: CartService,
    private userService: UserService,
    private toast: ToastrService
  ) {}
  cartProductList: ICartProduct[] = [];
  subTotal: number = 0;
  discount: number = 0;
  formContact: FormGroup = new FormGroup({
    user_name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    postcode: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    note: new FormControl(''),
    payment_method: new FormControl('check-payment'),
  });

  handleOrder() {
    if (this.formContact.status === 'VALID') {
      const order_list = this.cartProductList.map((item) => {
        delete item.description;
        return item;
      });
      const params = {
        user_id: 'b8fea1d4-b1b5-4782-a533-926936930588',
        ...this.formContact.value,
        status: 'NEW_ORDER',
        order_list,
        discount: this.discount,
      };
      this.checkoutService.addOrder(params);
    } else {
      this.toast.error('Please fill in this form');
    }
  }
  ngOnInit(): void {
    this.userService.userInfo$.subscribe((data) => {
      this.formContact.patchValue({
        user_name: data.name, 
        address: data.address, 
        phone: data.phoneNumber, 
        email: data.email, 
      });
      
    })
    this.cartService.cartProducts$.subscribe((data) => {
      this.cartProductList = data;
      this.subTotal = this.cartProductList.reduce(
        (total, currentValue) =>
          total + currentValue.price! * currentValue.quantity!,
        0
      );
    });
    this.cartService.voucher$.subscribe((data) => (this.discount = data));
  }
}
