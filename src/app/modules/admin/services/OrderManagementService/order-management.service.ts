import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { EOrderStatus, IOrder } from '../../type/order-management.type';
import { OrderManagementApiService } from './order-management-api.service';

@Injectable({
  providedIn: 'root',
})
export class OrderManagementService {
  constructor(
    private orderManagementApiService: OrderManagementApiService,
    private toast: ToastrService
  ) {}
  private ordersBS = new BehaviorSubject<IOrder[]>([]);
  private ordersThisMonthBS = new BehaviorSubject<IOrder[]>([]);
  get orders$() {
    return this.ordersBS.asObservable();
  }
  get ordersThisMonth$() {
    return this.ordersThisMonthBS.asObservable();
  }
  getOrders() {
    this.orderManagementApiService.getOrders().subscribe(
      (data) => {
        this.ordersBS.next(data);
      },
      (err) => {
        this.toast.error('Fetching data error!');
      }
    );
  }
  getOrdersThisMonth() {
    this.orderManagementApiService.getOrdersThisMonth().subscribe((data) => {
      this.ordersThisMonthBS.next(data)
    })
  }
  updateOrderStatus(id: string, status: EOrderStatus) {
    this.orderManagementApiService.updateOrderStatus(id, status).subscribe(
      () => {
        this.toast.success(`Update Order ${id} status ${status} successfully`);
      },
      () => {
        this.toast.error('Fetching data error!');
      }
    );
  }
  cancelOrder(id: string, status: EOrderStatus, callback: Function) {
    this.orderManagementApiService.updateOrderStatus(id, status).subscribe(
      () => {
        this.toast.success(`Cancel order ${id} successfully`);
        callback()
      },
      () => {
        this.toast.error('Fetching data error!');
      }
    );
  }
}
