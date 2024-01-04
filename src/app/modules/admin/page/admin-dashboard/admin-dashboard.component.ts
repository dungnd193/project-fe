import { Component, OnInit } from '@angular/core';
import { AdminDashboardService } from '../../services/AdminDashboardService/admin-dashboard.service';
import { ProductManagementService } from '../../services/ProductManagementService/product-management.service';
import { Subscription, combineLatest } from 'rxjs';
import { IProduct } from 'app/modules/product/type/product.type';
import moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { IOrder } from '../../type/order-management.type';
import { OrderManagementService } from '../../services/OrderManagementService/order-management.service';

interface Product {
  name: string;
  code: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private adminDashboardService: AdminDashboardService,
    private productService: ProductManagementService,
    private orderService: OrderManagementService,
  ) { }
  private subscriptions: Subscription[] = [];
  statisticForm!: FormGroup;
  stateOptions: any[] = [
    { label: 'Thống kê sản phẩm đã bán', value: 'TK1' },
    { label: 'Thống kê nhập hàng', value: 'TK2' }
  ];
  products: IProduct[] = [
    {
      "id": "",
      "name": "Tất cả sản phẩm",
      "description": "",
      "code": "",
      "category": {
        "id": "",
        "name": ""
      },
      "quantity": [],
      "price": 0,
      "status": "",
      "brand": "",
      "discount": 0,
      "viewCount": 0,
      "nameUrlImage": []
    }
  ];;
  chartDataSold: any;
  chartDataImport: any;
  options = {
    responsive: false,
    maintainAspectRatio: false,
  };
  data: any;
  chartOptions = {
    responsive: false,
  };
  selectedSoldProduct: IProduct | undefined;
  selectedImportedProduct: IProduct | undefined;
  startDate!: Date;
  endDate!: Date;
  maxDate!: Date;
  completedOrders!: IOrder[];

  monthlyImportedProducts: any = []
  monthlyStartDate!: Date;
  monthlyEndDate!: Date;
  monthlyMaxDate!: Date;
  handleStatistic() {
    const { value } = this.statisticForm.value
    if (value === 'TK1') {
      this.adminDashboardService.getOrderInRangeTime(
        {
          startDate: this.startDate,
          endDate: this.endDate,
          productId: this.selectedSoldProduct!.id!
        }
      )
    } else {
      this.adminDashboardService.getImportedProductInRangeTime(
        {
          startDate: this.startDate,
          endDate: this.endDate,
          productId: this.selectedImportedProduct!.id!,
          flag: 0
        }
      )
    }
  }
  handleDisplayDate(date: Date) {
    return moment(date).format("DD/MM/YYYY")
  }
  handleTotalIncome() {
    let totalPrice = 0
    this.completedOrders.forEach(order => {
      totalPrice += order.order_list.reduce(
        (total, currentValue) =>
          total + currentValue.price! * currentValue.quantity!,
        0
      ) * (1 - order.discount);
    })

    return totalPrice
  }
  handleTotalSoldProduct() {
    let totalSoldProduct = 0
    this.completedOrders.forEach(order => {
      totalSoldProduct += order.order_list.reduce(
        (total, currentValue) =>
          total + currentValue.quantity,
        0
      );
    })

    return totalSoldProduct
  }

  calculateImportedCost() {
    return this.monthlyImportedProducts.reduce((total: number, currentValue: any) =>
      total + currentValue.quantity*currentValue.imported_price_per_product, 0)
  }
  ngOnInit(): void {
    this.statisticForm = new FormGroup({
      value: new FormControl('TK1')
    });
    this.startDate = new Date();
    this.startDate.setDate(1);

    this.endDate = new Date();
    this.maxDate = new Date();

    this.monthlyStartDate = new Date();
    this.monthlyStartDate.setDate(1);

    this.monthlyEndDate = new Date();
    this.monthlyMaxDate = new Date();

    this.selectedSoldProduct = this.products[0]
    this.selectedImportedProduct = this.products[0]

    this.productService.getProducts({ page: 1, size: 9999 });
    this.adminDashboardService.getOrderInRangeTime(
      {
        startDate: this.startDate,
        endDate: this.endDate,
      }
    )
    this.adminDashboardService.getImportedProductInRangeTime(
      {
        startDate: this.startDate,
        endDate: this.endDate,
        flag: 0
      }
    )
    this.adminDashboardService.getImportedProductInMonth(
      {
        startDate: this.monthlyStartDate,
        endDate: this.monthlyEndDate,
        flag: 1
      }
    )
    this.orderService.getOrdersThisMonth()

    const subscription = combineLatest([
      this.productService.products$,
      this.adminDashboardService.dataStatistic$,
      this.adminDashboardService.importedProductBS$,
      this.orderService.ordersThisMonth$,
      this.adminDashboardService.monthlyImportedProductBS$,
    ]).subscribe((data) => {
      this.products = [
        {
          "id": "",
          "name": "Tất cả sản phẩm",
          "description": "",
          "code": "",
          "category": {
            "id": "",
            "name": ""
          },
          "quantity": [],
          "price": 0,
          "status": "",
          "brand": "",
          "discount": 0,
          "viewCount": 0,
          "nameUrlImage": []
        },
        ...data[0]
      ];

      this.chartDataSold = {
        labels: data[1].map(item => moment(item.date).format('DD/MM')),
        datasets: [
          {
            label: this.selectedSoldProduct?.name || '',
            backgroundColor: '#21C55E',
            data: data[1].map(item => item.quantity),
          },
        ],
      };
      this.chartDataImport = {
        labels: data[2].map(item => moment(item.date).format('DD/MM')),
        datasets: [
          {
            label: this.selectedImportedProduct?.name || '',
            backgroundColor: '#EF4197',
            data: data[2].map(item => item.quantity),
          },
        ],
      };

      this.completedOrders = data[3].filter(order => order.status === "COMPLETED");
      
      this.monthlyImportedProducts = data[4]

    });

    this.data = {
      labels: [
        'Total Income',
        'Total Expences',
        'Cash on Hand',
        'Net Profit Margin',
      ],
      datasets: [
        {
          data: [579000, 79000, 92000, 179000],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#9C7B82'],
          hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#9C7B82'],
        },
      ],
    };


    this.subscriptions.push(subscription);
  }
}
