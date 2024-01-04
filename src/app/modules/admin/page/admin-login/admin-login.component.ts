import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/AdminService/admin.service';

enum ERole {
  ROLE_ADMIN,
  ROLE_USER,
}
@Component({
  selector: 'app-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  constructor(private adminService: AdminService, private router: Router) {}
  showPassword: boolean = false;
  formLogin: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  onSubmit() {
    if (this.formLogin.valid) {
      console.log(this.formLogin.value);
      this.adminService.adminLogin(this.formLogin.value);
    }
  }
  ngOnInit(): void {
    const roles = localStorage.getItem('role')!;
    const accessToken = localStorage.getItem('accessToken')!;
    const isAdmin = roles?.includes(ERole[ERole.ROLE_ADMIN]);
    if (isAdmin && accessToken) {
      this.router.navigate(['/admin/dashboard']);
    }
  }
}
