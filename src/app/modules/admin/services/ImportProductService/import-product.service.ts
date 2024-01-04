import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ImportProductApiService } from './import-product-api.service';
import { AdminDashboardService } from '../AdminDashboardService/admin-dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class ImportProductService {
  constructor(
    private importProductApiService: ImportProductApiService,
    private adminDashboardService: AdminDashboardService,
    private toast: ToastrService,
  ) {}
  saveImportProduct(importProduct: any) {
    this.importProductApiService.saveImportProduct(importProduct).subscribe(() => {
      this.adminDashboardService.getImportedProductInRangeTime(
        {
          startDate: new Date("2023-01-01T00:00:00.000Z"),
          endDate: new Date("2023-12-31T23:59:59.000Z"),
          flag: 0
        }
      )
      this.toast.success("Save imported product successfully!")
    });
  }

}
