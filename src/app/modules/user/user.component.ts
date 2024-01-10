import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication/service/authentication.service';
import { UserService } from './service/user.service';

interface IEditingArgs {
  field: 'isEditingName' | 'isEditingDOB' | 'isEditingGender' | 'isEdittingPhoneNumber' | 'isEdittingEmail' | 'isEdittingAddress';
  value: boolean
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  constructor(
    private userService: UserService,
  ) { }
  genders!: any[];
  selectedGender: any;
  isEditingName = false;
  isEditingDOB = false;
  isEditingGender = false;
  isEdittingPhoneNumber = false;
  isEdittingEmail = false;
  isEdittingAddress = false;

  name: string = '';
  email: string = '';
  address: string = '';
  gender = { gender: 'Nam', gender_code: 'MALE' };
  dob = new Date();
  phoneNumber: string = '';
  avatarPath: string = '';

  visible: boolean = false;
  selectedImage: string | undefined;
  fileSelected: any;

  fd = new FormData();

  isEditting({ field, value }: IEditingArgs) {
    this[field] = value
  }

  handleUpdateUserInfo() {
    this.userService.updateUserInfo({
      name: this.name,
      email: this.email,
      gender: this.gender.gender_code,
      dob: this.dob.toString(),
      address: this.address,
      phoneNumber: this.phoneNumber
    })
    console.log({
      name: this.name,
      email: this.email,
      gender: this.gender,
      dob: this.dob.toString(),
      address: this.address,
      phoneNumber: this.phoneNumber
    })
  }

  showDialog() {
      this.visible = true;
  }

  handleFileSelect(event: any): void {
    this.fileSelected = event.target.files[0];
    this.fd.append('image', this.fileSelected, this.fileSelected.name);

    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.selectedImage = e.target.result;
    };

    reader.readAsDataURL(this.fileSelected);
  }

  handleUpdateAvatar() {
    this.userService.uploadUserAvatar(this.fd)
  }

  ngOnInit(): void {
    this.genders = [
      { gender: 'Nam', gender_code: 'MALE' },
      { gender: 'Nữ', gender_code: 'FEMALE' },
      { gender: 'Khác', gender_code: 'OTHER' },
    ]
    this.userService.userInfo$.subscribe((data) => {
      this.avatarPath = data.avatarPath ? 'http://localhost:8080/images/user-avatar/' + data.avatarPath : ''
      this.name = data.name
      this.email = data.email
      this.address = data.address
      this.gender = this.genders.find(gender => gender.gender_code === data.gender);
      this.dob = new Date(data.dob)
      this.phoneNumber = data.phoneNumber
    })
  }
}
