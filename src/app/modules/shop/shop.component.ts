import { Component, OnInit, ViewChild } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { ToastrService } from 'ngx-toastr';
import { SelectItem } from 'primeng/api';
import { combineLatest, Subject } from 'rxjs';
import { ICategories, IColors } from '../admin/type/product-management.type';
import { CartService } from '../cart/service/cart.service';
import { ProductManagementService } from './../admin/services/ProductManagementService/product-management.service';
import { ShopService } from './services/shop.service';
import { IProduct } from './type/shop.type';
import { Paginator } from 'primeng/paginator';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  constructor(
    private shopService: ShopService,
    private cartService: CartService,
    private productManagementService: ProductManagementService,
    private toast: ToastrService
  ) {}
  @ViewChild('paginator', { static: true }) paginator!: Paginator;

  products!: IProduct[];
  totalProducts: number = 0;
  sortOptions!: SelectItem[];
  sortOrder!: number;
  sortField!: string;
  sortKey!: string;
  rangeValues: number[] = [20, 80];
  priceUnit: number = 100000;
  colorFilterList: IColors[] = [];
  categoryFilterList: ICategories[] = [];
  page: number = 1;
  private sort: 'ASC' | 'DESC' = 'ASC';
  private orderBy: string = '';
  private colorId: string = '';
  private categoryId: string = '';
  private name: string = '';
  private start: number = 0;
  private end: number = 0;

  isShowAllCategories: boolean = false;
  handleSortByOrder(event: any) {
    this.page = 1;
    this.paginator.changePage(this.page - 1);
    this.sort = event.value.toUpperCase();
    this.orderBy = 'price';
    const { sort, orderBy, colorId, categoryId, name, start, end, page } = this;

    this.shopService.getProducts({
      page,
      size: 6,
      sort: event.value.toUpperCase(),
      orderBy,
      colorId,
      categoryId,
      name,
      start,
      end,
    });
  }
  handleFilterByName(event: Event) {
    this.page = 1;
    this.paginator.changePage(this.page - 1);
    this.name = (event.target! as HTMLInputElement).value;
    const { sort, orderBy, colorId, categoryId, name, start, end, page } = this;

    this.shopService.getProducts({
      page,
      size: 6,
      sort,
      orderBy,
      colorId,
      categoryId,
      name: (event.target! as HTMLInputElement).value,
      start,
      end,
    });
  }
  handleFilterByPrice() {
    this.page = 1;
    this.paginator.changePage(this.page - 1);
    this.orderBy = 'price';
    this.start = this.rangeValues[0] * this.priceUnit;
    this.end = this.rangeValues[1] * this.priceUnit;
    const { sort, orderBy, colorId, categoryId, name, start, end, page } = this;
    this.shopService.getProducts({
      page,
      size: 6,
      sort,
      orderBy,
      colorId,
      categoryId,
      name,
      start,
      end,
    });
  }
  handleFilterByColors(event: MatRadioChange) {
    this.page = 1;
    this.paginator.changePage(this.page - 1);
    this.colorId = event.value;
    const { sort, orderBy, colorId, categoryId, name, start, end, page } = this;

    this.shopService.getProducts({
      page,
      size: 6,
      sort,
      orderBy,
      colorId: event.value,
      categoryId,
      name,
      start,
      end,
    });
  }
  handleFilterByCategories(event: MatRadioChange) {
    this.page = 1;
    const { sort, orderBy, colorId, categoryId, name, start, end, page } = this;

    this.paginator.changePage(this.page - 1);
    this.categoryId = event.value;

    this.shopService.getProducts({
      page,
      size: 6,
      sort,
      orderBy,
      colorId,
      categoryId: event.value,
      name,
      start,
      end,
    });
  }
  paginate(event: any, callApi = true) {
    this.page = event.page + 1;
    const { sort, orderBy, colorId, categoryId, name, start, end, page } = this;
    if (callApi) {
      this.shopService.getProducts({
        page,
        size: 6,
        sort,
        orderBy,
        colorId,
        categoryId,
        name,
        start,
        end,
      });
    }
  }
  handleShowMoreCategories() {
    this.isShowAllCategories = !this.isShowAllCategories;
  }
  handleAddProductToCart(product: IProduct) {
    this.cartService.addProductToCart(product);
    console.log(product);
  }
  ngOnInit(): void {
    this.productManagementService.getColors();
    this.productManagementService.getCategories();
    this.shopService.getProducts({ page: 1, size: 6, sort: this.sort });

    combineLatest(
      this.productManagementService.colors$,
      this.productManagementService.categories$
    ).subscribe((data) => {
      (this.colorFilterList = data[0]), (this.categoryFilterList = data[1]);
    });

    this.sortOptions = [
      { label: 'Price Low to High', value: 'asc' },
      { label: 'Price High to Low', value: 'desc' },
    ];

    this.shopService.products$.subscribe((data) => {
      this.products = data;
    });
    this.shopService.totalProducts$.subscribe(
      (data) => (this.totalProducts = data)
    );
  }
}
