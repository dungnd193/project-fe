import { Injectable } from '@angular/core';
import { CartService } from 'app/modules/cart/service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from './user-api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private toastr: ToastrService,
    private userApiService: UserApiService,
  ) { }
  private userInfoBS = new BehaviorSubject<any>({});

  get userInfo$() {
    return this.userInfoBS.asObservable();
  }

  public isOrderSuccess: boolean = false;

  getUserInfo() {
    this.userApiService.getUserInfo().subscribe(
      (data) => {
        this.userInfoBS.next(data)
      },
      () => {
        // this.toastr.error('Get user information error!');
      }
    );
  }

  updateUserInfo(userInfo: any) {
    this.userApiService.updateUserInfo(userInfo).subscribe(() => {
      this.getUserInfo()
      this.toastr.success('Update user information successfully!');
    }, (error) => {
      this.toastr.error('Update user information error!');
    })
  }

  uploadUserAvatar(fd: FormData) {
    this.userApiService
      .uploadUserAvatar(fd)
      .subscribe(({nameUrlImage}) => {
        this.updateUserInfo({
          avatarPath: nameUrlImage[0].fileName
        })
      });
  }
}
