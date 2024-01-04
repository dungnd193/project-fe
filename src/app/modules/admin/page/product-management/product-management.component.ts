import { Component, OnInit, ViewChild } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import {
  IColors as IColorsProduct,
  IProduct,
} from 'app/modules/product/type/product.type';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { BehaviorSubject, combineLatest } from 'rxjs';
import {
  ICategories,
  IColors,
  IDetailRow,
  ISizes,
} from '../../type/product-management.type';
import { ProductManagementService } from './../../services/ProductManagementService/product-management.service';

@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent implements OnInit {
  @ViewChild('productTable') productTable!: Table;
  productDialog!: boolean;
  products!: IProduct[];
  product!: IProduct;
  selectedProducts?: IProduct[] | null;
  statuses!: any[];
  uploadedFiles: any[] = [];
  productImg: string[] = [];
  productImgNeedToDelete: string[] = [];
  totalProducts: number = 0;
  categories: ICategories[] = [];
  colors: IColors[] = [];
  sizes: ISizes[] = [];
  detailRow!: IDetailRow[];
  fd = new FormData();
  colorUploadImg!: IColorsProduct;
  detailDataRow = new BehaviorSubject<any[]>([]);
  nameUrlImage: { fileName: string; originalName: string }[] = [];

  get detailDataRow$() {
    return this.detailDataRow.asObservable();
  }
  set detailDataRowBS(value: any) {
    this.detailDataRow.next(value);
  }
  constructor(
    private productService: ProductManagementService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}
  paginate(event: any) {
    console.log(event);
    this.productService.getProducts({ page: event.page + 1, size: 6 });
  }
  handleOpenEditProductDialog(product: IProduct) {
    this.productService.getProductDetail(product.id!, () => {
      this.productDialog = true;
    });
  }
  handleOpenAddProductDialog() {
    this.productDialog = true;
  }
  handleCloseDialog() {
    this.productImg = [];
    this.productService.currentProduct = {} as IProduct;
    this.detailDataRowBS = [];
    this.productImgNeedToDelete = [];
    this.productDialog = false;
    this.nameUrlImage.forEach((item) => {
      this.productService.deleteProductImage(item.fileName);
    });
    this.productService.nameUrlImage = [];
  }

  handleAddColorAndSize() {
    const newArr = [
      ...this.detailDataRow.getValue(),
      {
        color: {} as IColors,
        size: {} as ISizes,
        quantity: 0,
      },
    ];
    this.detailDataRowBS = newArr;
  }
  handleDeleteColorAndSize(value: IDetailRow) {
    const newArr = this.detailDataRow
      .getValue()
      .filter((item: IDetailRow) => item !== value);
    this.detailDataRowBS = newArr;
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productService.deleteSelectedProducts(
          this.selectedProducts as IProduct[]
        );
        this.selectedProducts = null;
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000,
        });
      },
    });
  }
  deleteProduct(product: IProduct) {
    this.confirmationService.confirm({
      message:
        'Are you sure you want to delete product: "' + product.name + '"?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        product.nameUrlImage?.forEach((fileName) => {
          this.productService.deleteProductImage(fileName);
        });
        this.productService.deleteProduct(product.id!);
      },
    });
  }
  saveProduct() {
    const quantity = this.detailRow.map((item) => ({
      sizeId: item.size.id,
      sizeName: item.size.name,
      colorId: item.color.id,
      colorCode: item.color.code,
      colorName: item.color.name,
      quantity: item.quantity,
    }));
    if (this.product.id) {
      const product = {
        ...this.product,
        quantity,
        nameUrlImage: [
          ...this.productImg,
          ...this.nameUrlImage.map((item) => item.fileName),
        ],
      };

      this.productService.editProduct(product);
      if (this.productImgNeedToDelete.length) {
        this.productImgNeedToDelete.forEach((fileName) =>
          this.productService.deleteProductImage(fileName)
        );
      }
      this.productDialog = false;
      this.productService.nameUrlImage = [];
      this.productService.currentProduct = {} as IProduct;
      return;
    }
    const product = {
      ...this.product,
      viewCount: 0,
      status: 'INSTOCK',
      quantity,
      nameUrlImage: this.nameUrlImage.map((item) => item.fileName),
    };
    this.productService.saveProduct(product);
    this.productDialog = false;
    this.productService.nameUrlImage = [];
    this.productService.currentProduct = {} as IProduct;
  }

  handleUploadImg(originalEvent: any, files: any, currentFiles: any) {
    currentFiles.currentFiles.forEach((file: File) => {
      this.fd.append('image', file, file.name);
    });

    this.productService.uploadProductImage(currentFiles.currentFiles);

    this.messageService.add({
      severity: 'info',
      summary: 'File Uploaded',
      detail: '',
    });
  }

  handleRemoveImg(originalEvent: any, file: any) {
    // Update formData when remove img
    this.fd = new FormData();
    let list: File[] = [];
    for (var pair of this.fd.entries()) {
      list = [...list, pair[1] as File];
    }
    list.forEach((item) => {
      if (item.name !== file.file.name) {
        this.fd.append('image', file, file.name);
      }
    });
    const fileDeleted = this.nameUrlImage.find(
      (item) => item.originalName === file.file.name
    );

    this.productService.deleteProductImage(fileDeleted!.fileName);

    this.productService.nameUrlImage = this.nameUrlImage.filter(
      (item) => item.originalName !== file.file.name
    );
  }

  handleFilterBlobal(event: Event) {
    this.productTable.filterGlobal(
      (event.target! as HTMLInputElement).value,
      'contains'
    );
  }

  handleChangeCategory(event: MatRadioChange) {
    this.product.category = event.value;
  }

  handleDeleteProductImage(fileName: string) {
    this.productImgNeedToDelete.push(fileName);
    this.productImg = this.productImg.filter((item) => item !== fileName);
    // this.productService.deleteProductImage(fileName);
  }

  ngOnInit(): void {
    this.productService.getProducts({ page: 1, size: 6 });
    this.productService.getCategories();
    this.productService.getColors();
    this.productService.getSizes();

    combineLatest([
      this.productService.products$,
      this.productService.totalProducts$,
      this.productService.categories$,
      this.productService.colors$,
      this.productService.sizes$,
      this.productService.currentProduct$,
    ]).subscribe((data) => {
      this.products = data[0];
      this.totalProducts = data[1];
      this.categories = data[2];
      this.colors = data[3];
      this.sizes = data[4];
      this.product = data[5];
      this.productImg = data[5].nameUrlImage || [];
      this.detailDataRowBS = data[5].quantity?.map((item) => ({
        color: { id: item.colorId, code: item.colorCode, name: item.colorName },
        size: { id: item.sizeId, name: item.sizeName },
        quantity: item.quantity,
      }));
    });

    this.detailDataRow$.subscribe((data) => {
      this.detailRow = data;
    });

    this.productService.nameUrlImage$.subscribe((data) => {
      this.nameUrlImage = data;
    });

    this.statuses = [
      { label: 'INSTOCK', value: 'instock' },
      { label: 'LOWSTOCK', value: 'lowstock' },
      { label: 'OUTOFSTOCK', value: 'outofstock' },
    ];
  }
}
