import { NgModule } from '@angular/core';
import { MyOrdersRoutingModule } from './my-orders-routing.module';
import { PrimeModule } from 'app/core/prime/prime.module';
import { MyOrdersComponent } from './my-orders.component';

@NgModule({
  declarations: [MyOrdersComponent],
  imports: [MyOrdersRoutingModule, PrimeModule],
})
export class MyOrdersModule {}
