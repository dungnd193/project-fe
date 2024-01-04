import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IAdminLogin } from '../../type/admin.type';
import { AdminApiService } from './admin-api.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

interface IAccessTokenDecoded {
  exp: number;
  iat: number;
  role: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(
    private adminApiService: AdminApiService,
    private toast: ToastrService,
    private router: Router
  ) {}
  adminLogin(admin: IAdminLogin) {
    this.adminApiService.adminLogin(admin).subscribe(
      (response: any) => {
        const accessToken = response.accessToken;
        const { role } = jwt_decode(accessToken) as IAccessTokenDecoded;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('role', role);
        this.router.navigate(['/admin/dashboard']);
        this.toast.success('Logged in successfully!');
      },
      () => {
        this.toast.error('Log in error!');
      }
    );
  }
}
