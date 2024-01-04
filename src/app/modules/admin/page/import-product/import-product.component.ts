import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductManagementService } from '../../services/ProductManagementService/product-management.service';
import { combineLatest } from 'rxjs';
import { Table } from 'primeng/table';
import { ICategories, IColors, ISizes } from '../../type/product-management.type';
import { AdminDashboardService } from '../../services/AdminDashboardService/admin-dashboard.service';
import moment from 'moment';
import { ImportProductService } from '../../services/ImportProductService/import-product.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-import-product',
  templateUrl: './import-product.component.html',
  styleUrls: ['./import-product.component.scss'],
})
export class ImportProductComponent implements OnInit {
  constructor(
    private adminDashboardService: AdminDashboardService,
    private productService: ProductManagementService,
    private importProductService: ImportProductService,
  ) { }
  @ViewChild('importedProductsTable') importedProductsTable!: Table;
  products: any[] = [];
  importedProducts!: any[];
  selectedProduct: any;
  colorFilterList: IColors[] = [];
  sizeFilterList: ICategories[] = [];
  productDialog = false;
  colors: IColors[] = [];
  sizes: ISizes[] = [];
  newImportProduct:any = {
    size : {},
    color : {},
    quantity : 0,
    imported_price_per_product : 0,

  }
  
  handleFilterBlobal(event: Event) {
    this.importedProductsTable.filterGlobal(
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
  handleTotalPrice(order_list: any[]) {
    return order_list.reduce(
      (total, currentValue) =>
        total + currentValue.price! * currentValue.quantity!,
      0
    );
  }
  handleDate(d: string) {
    return moment(d).format("DD/MM/YYYY")
  }
  handleOpenAddProductDialog() {
    this.productDialog = true;
  }
  handleCloseDialog() {
    this.productDialog = false;
  }
  saveImportedProduct() {
    const iP = {
      product_id: this.selectedProduct.id,
      product_name: this.selectedProduct.name,
      size_id: this.newImportProduct.size.id,
      size_name: this.newImportProduct.size.name,
      color_id: this.newImportProduct.color.id,
      color_name: this.newImportProduct.color.name,
      quantity: this.newImportProduct.quantity,
      imported_price_per_product: this.newImportProduct.imported_price_per_product
    }
    this.importProductService.saveImportProduct(iP)
    this.productDialog = false;
  }

  handleExportToExcel() {
    const fileName = "import_product";

    const renamedData = this.importedProducts.map(item => ({
      "Tên sản phẩm": item.product_name,
      "Kích thước": item.size_name,
      "Màu sắc": item.color_name,
      "Giá nhập": item.imported_price_per_product,
      "Ngày nhập": moment(item.createdAt).format("DD/MM/YYYY")
    }));

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
    this.productService.getColors();
    this.productService.getSizes();
    this.productService.getProducts({ page: 1, size: 9999 });
    this.adminDashboardService.getImportedProductInRangeTime(
      {
        startDate: new Date("2023-01-01T00:00:00.000Z"),
        endDate: new Date("2023-12-31T23:59:59.000Z"),
        flag: 1
      }
    )
    combineLatest([
      this.adminDashboardService.importedProductBS$,
      this.productService.products$,
      this.productService.colors$,
      this.productService.sizes$,
    ]).subscribe((data) => {
      this.importedProducts = data[0]
      this.products = [
        ...data[1]
      ];
      this.colors = data[2];
      this.sizes = data[3];
    })
  }
}
