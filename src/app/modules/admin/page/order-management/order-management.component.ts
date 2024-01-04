import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { combineLatest } from 'rxjs';
import { ProductManagementService } from '../../services/ProductManagementService/product-management.service';
import { OrderManagementService } from '../../services/OrderManagementService/order-management.service';
import {
  IOrder,
  IOrderItem,
  IUserInfo,
} from '../../type/order-management.type';
import { ICategories, IColors } from '../../type/product-management.type';
import moment from 'moment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
})
export class OrderManagementComponent implements OnInit {
  @ViewChild('userTable') userTable!: Table;
  orders!: IOrder[];
  submitted!: boolean;
  colorFilterList: IColors[] = [];
  sizeFilterList: ICategories[] = [];
  statuses = [
    { label: 'Mới đặt hàng', value: 'NEW_ORDER' },
    { label: 'Đang vận chuyển', value: 'DELIVERING' },
    { label: 'Đã giao hàng', value: 'COMPLETED' },
    { label: 'Đã huỷ', value: 'CANCELLED' },
  ];
  constructor(
    private orderService: OrderManagementService,
    private productManagementService: ProductManagementService
  ) {}
  handleFilterBlobal(event: Event) {
    this.userTable.filterGlobal(
      (event.target! as HTMLInputElement).value,
      'contains'
    );
  }

  handleConvertColor(colorId: string) {
    return this.colorFilterList.find((item) => item.id === colorId)?.name;
  }
  handleConvertSize(sizeId: string) {
    return this.sizeFilterList.find((item) => item.id === sizeId)?.name;
  }
  handleTotalPrice(order_list: IOrderItem[]) {
    return order_list.reduce(
      (total, currentValue) =>
        total + currentValue.price! * currentValue.quantity!,
      0
    );
  }
  handleChangeOrderStatus(event: any, id: string) {
    this.orderService.updateOrderStatus(id, event.value);
  }
  handleExportToExcel() {
    const fileName = "orders";

    const renamedData = this.orders.map(item => {
      let products = ""
      item.order_list.forEach(order_item => {
        products += `${order_item.name} - Màu: ${this.handleConvertColor(order_item.colorId)} - Kích cỡ: ${this.handleConvertSize(order_item.sizeId)} - Số lượng: ${order_item.quantity}\n`
      })
      return {
        "Tên khách hàng": item.user_name,
        "Địa chỉ": item.address,
        "Postcode": item.postcode,
        "Email": item.email,
        "Ghi chú": item.note,
        "Chi tiết đơn hàng": products.slice(0, -1),
        "Giảm giá": `${item.discount*100}%`,
        "Tổng tiền": this.handleTotalPrice(item.order_list),
        "Ngày đặt hàng": moment(item.createdAt).format("DD/MM/YYYY"),
        "Trạng thái đơn hàng": item.status
      }
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(renamedData);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName + '.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  ngOnInit(): void {
    this.orderService.getOrders();
    this.productManagementService.getColors();
    this.productManagementService.getSizes();

    combineLatest(
      this.productManagementService.colors$,
      this.productManagementService.sizes$,
      this.orderService.orders$
    ).subscribe((data) => {
      (this.colorFilterList = data[0]),
        (this.sizeFilterList = data[1]),
        (this.orders = data[2]);
    });
  }
}
