import { NgModule } from '@angular/core';
import { UserRoutingModule } from './user-routing.module';
import { PrimeModule } from 'app/core/prime/prime.module';
import { UserComponent } from './user.component';

@NgModule({
  declarations: [UserComponent],
  imports: [UserRoutingModule, PrimeModule],
})
export class UserModule {}
