import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/core/material/material.module';
import { PrimeModule } from 'app/core/prime/prime.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './page/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './page/admin-login/admin-login.component';
import { ProductManagementComponent } from './page/product-management/product-management.component';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { OrderManagementComponent } from './page/order-management/order-management.component';
import { ImportProductComponent } from './page/import-product/import-product.component';
@NgModule({
  declarations: [
    AdminComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    ProductManagementComponent,
    OrderManagementComponent,
    ImportProductComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    PrimeModule,
    HttpClientModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class AdminModule {}
