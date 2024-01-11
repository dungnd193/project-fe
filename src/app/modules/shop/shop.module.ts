import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'app/core/material/material.module';
import { PrimeModule } from 'app/core/prime/prime.module';
import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';

@NgModule({
  imports: [
    ShopRoutingModule,
    ReactiveFormsModule,
    PrimeModule,
    HttpClientModule,
    CommonModule,
    MaterialModule,
  ],
  declarations: [ShopComponent],
  exports: [],
})
export class ShopModule {}
