import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { ILoginRequest, IRegisterRequest } from '../type/authentication.type';
import { AuthenticationApiService } from './authentication-api.service';

interface IAccessTokenDecoded {
  exp: number;
  iat: number;
  role: string;
  username: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private authApiService: AuthenticationApiService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  private userInfor = new BehaviorSubject({
    name: '',
    surname: '',
    userName: '',
    emailAddress: '',
    avatarPath: '',
  });

  get userInfor$() {
    return this.userInfor.asObservable();
  }
  logIn(payload: ILoginRequest) {
    return this.authApiService.logIn(payload).subscribe(
      (data) => {
        console.log(data);
        const { role } = jwt_decode(data.accessToken) as IAccessTokenDecoded;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('role', role);
        this.toastr.success('Login Successfully!');
        this.router.navigate(['/home']);
      },
      (err) => {
        this.toastr.error('Login failure!');
      }
    );
  }
  register(payload: IRegisterRequest) {
    return this.authApiService.register(payload).subscribe(
      (data) => {
        this.toastr.success('Register Successfully!');
        this.router.navigate(['/auth/login']);
      },
      (err) => this.toastr.error('Register Failure!')
    );
  }
  loggedIn() {
    return (
      localStorage.getItem('accessToken') &&
      localStorage.getItem('role') === 'ROLE_USER'
    );
  }
}
