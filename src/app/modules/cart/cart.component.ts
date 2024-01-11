import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';
import { ProductManagementService } from '../admin/services/ProductManagementService/product-management.service';
import { IProduct } from '../shop/type/shop.type';
import { CartService } from './service/cart.service';
import { ICartProduct } from './type/cart.type';
import { ICategories, IColors } from '../admin/type/product-management.type';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private productManagementService: ProductManagementService,
    private toastr: ToastrService
  ) {}

  cartProductList: ICartProduct[] = [];
  colorFilterList: IColors[] = [];
  sizeFilterList: ICategories[] = [];
  subTotal: number = 0;
  discount: number = 0;
  voucher: string = '';
  formatter = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  handleRemoveProduct(product: ICartProduct) {
    this.cartService.removeProduct(product);
  }
  handleIncreaseAmount(product: ICartProduct) {
    product.quantity!++;
    this.cartService.updateProductInCart(product);
  }
  handleDecreaseAmount(product: ICartProduct) {
    if (product.quantity! > 1) {
      product.quantity!--;
      this.cartService.updateProductInCart(product);
    }
  }
  handleClearShoppingCart() {
    this.cartService.clearShoppingCart();
  }

  handleApplyVoucher() {
    switch (this.voucher) {
      case 'FREE50': {
        this.cartService.voucherBS = 0.5;
        break;
      }
      case 'TET2023': {
        this.cartService.voucherBS = 0.3;
        break;
      }
      default: {
        this.toastr.error('Invalid coupon!');
        this.cartService.voucherBS = 0;
        break;
      }
    }
  }
  handleConvertColor(colorId: string) {
    return this.colorFilterList.find((item) => item.id === colorId)?.name;
  }
  handleConvertSize(sizeId: string) {
    return this.sizeFilterList.find((item) => item.id === sizeId)?.name;
  }

  ngOnInit(): void {
    this.productManagementService.getColors();
    this.productManagementService.getSizes();
    this.cartService.voucherBS = 0;

    this.cartService.cartProducts$.subscribe((data) => {
      this.cartProductList = data;
      this.subTotal = this.cartProductList.reduce(
        (total, currentValue) =>
          total + currentValue.price! * currentValue.quantity!,
        0
      );
    });

    this.cartService.voucher$.subscribe((data) => (this.discount = data));

    combineLatest(
      this.productManagementService.colors$,
      this.productManagementService.sizes$
    ).subscribe((data) => {
      (this.colorFilterList = data[0]), (this.sizeFilterList = data[1]);
    });
  }
}
