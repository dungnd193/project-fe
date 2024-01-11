import { Component, OnInit } from '@angular/core';
import { MyOrdersService } from './service/my-orders.service';
import { UserService } from '../user/service/user.service';
import { ProductManagementService } from '../admin/services/ProductManagementService/product-management.service';
import { IColors, ISizes } from '../admin/type/product-management.type';
import { combineLatest } from 'rxjs';
import moment from 'moment';
import { IOrderItem } from '../checkout/type/checkout.type';
import { OrderManagementService } from '../admin/services/OrderManagementService/order-management.service';
import { EOrderStatus } from '../admin/type/order-management.type';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit {
  userId: string = ''
  count = 0
  tabs: any[] = []
  myOrders: any[] = []
  myOrdersFilter: any[] = []
  colors: IColors[] = [];
  sizes: ISizes[] = [];
  currentIdx = 0
  constructor(
    private userService: UserService,
    private myOrderService: MyOrdersService,
    private productService: ProductManagementService,
    private orderService: OrderManagementService
  ) { }

  handleConvertColor(colorId: string) {
    return this.colors.find((item) => item.id === colorId)?.name;
  }
  handleConvertSize(sizeId: string) {
    return this.sizes.find((item) => item.id === sizeId)?.name;
  }
  handleConvertDate(date: string) {
    return moment(date).format("DD/MM/YYYY")
  }
  handleTotalPrice(order_list: IOrderItem[]) {
    return order_list.reduce(
      (total, currentValue) =>
        total + currentValue.price! * currentValue.quantity!,
      0
    );
  }
  handleOrderStatus(status: string) {
    if (status === 'NEW_ORDER') return 'Đang chờ xác nhận đơn hàng'
    if (status === 'DELIVERING') return 'Đơn hàng đang được vận chuyển'
    if (status === 'COMPLETED') return 'Đã giao hàng thành công'
    if (status === 'CANCELLED') return 'Đơn hàng đã bị huỷ'
    return ''
  }

  handleCancelOrder(orderId: string) {
    this.orderService.cancelOrder(orderId, EOrderStatus.CANCELLED, () => {
      this.myOrderService.getMyOrders(this.userId)
    });
  }
  handleFilter(idx: number) {
    // Status = ALL
    if (idx === 0) {
      this.myOrdersFilter = this.myOrders
    }
    // Status = NEW_ORDER
    if (idx === 1) {
      this.myOrdersFilter = this.myOrders.filter(order => order.status === "NEW_ORDER")
    }
    // Status = DELIVERING
    if (idx === 2) {
      this.myOrdersFilter = this.myOrders.filter(order => order.status === "DELIVERING")
    }
    // Status = COMPLETED
    if (idx === 3) {
      this.myOrdersFilter = this.myOrders.filter(order => order.status === "COMPLETED")
    }
    // Status = CANCELLED
    if (idx === 4) {
      this.myOrdersFilter = this.myOrders.filter(order => order.status === "CANCELLED")
    }
  }

  onTabChange(event: any) {
    this.currentIdx = event.index
    this.handleFilter(this.currentIdx)
  }

  ngOnInit(): void {
    this.productService.getColors();
    this.productService.getSizes();
    this.userService.userInfo$.subscribe((data) => {
      this.userId = data.id
      this.myOrderService.getMyOrders(this.userId)
    })

    this.myOrderService.myOrdersBS$.subscribe((data) => {
      this.myOrders = data
      this.myOrdersFilter = this.myOrders
      this.handleFilter(this.currentIdx)

    })


    combineLatest([
      this.productService.colors$,
      this.productService.sizes$,
    ]).subscribe((data) => {
      this.colors = data[0];
      this.sizes = data[1];
    })

    this.tabs = [
      { title: 'Tất cả' },
      { title: 'Mới đặt hàng' },
      { title: 'Đang vận chuyển' },
      { title: 'Đã giao hàng' },
      { title: 'Đã huỷ' },
    ];


  }

}
