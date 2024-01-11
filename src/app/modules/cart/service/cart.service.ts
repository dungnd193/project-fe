import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { ICartProduct } from '../type/cart.type';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private toastr: ToastrService) {}
  private cartProductsBS = new BehaviorSubject<ICartProduct[]>([]);
  private discount = new BehaviorSubject<number>(0);
  get cartProducts$() {
    return this.cartProductsBS.asObservable();
  }
  get voucher$() {
    return this.discount.asObservable();
  }
  set voucherBS(value: number) {
    this.discount.next(value);
  }

  set cartProducts(products: ICartProduct[]) {
    this.cartProductsBS.next(products);
  }
  getCartProducts() {
    const cartProducts =
      JSON.parse(localStorage.getItem('cartProducts')!) || [];
    this.cartProductsBS.next(cartProducts);
  }
  addProductToCart(product: ICartProduct) {
    const cartProducts = this.cartProductsBS.getValue();
    this.cartProductsBS.next([...cartProducts, product]);
    localStorage.setItem(
      'cartProducts',
      JSON.stringify([...cartProducts, product])
    );
    this.toastr.success('Product successfully added');
  }
  removeProduct(product: ICartProduct) {
    const cartProducts =
      JSON.parse(localStorage.getItem('cartProducts')!) || [];

    const restProducts = cartProducts.filter(
      (item: ICartProduct) => item.product_id !== product.product_id
    );
    localStorage.setItem('cartProducts', JSON.stringify(restProducts));
    this.cartProductsBS.next(restProducts);
  }
  clearShoppingCart() {
    localStorage.setItem('cartProducts', JSON.stringify([]));
    this.cartProductsBS.next([]);
  }
  updateProductInCart(product: ICartProduct) {
    const cartProducts =
      JSON.parse(localStorage.getItem('cartProducts')!) || [];
    const newCartProducts = cartProducts.map((item: ICartProduct) => {
      if (item.id === product.id) {
        item.quantity = product.quantity;
      }
      return item;
    });
    localStorage.setItem('cartProducts', JSON.stringify(newCartProducts));
    this.cartProductsBS.next(newCartProducts);
  }
}
