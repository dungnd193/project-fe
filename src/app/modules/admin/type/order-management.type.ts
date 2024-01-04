export interface IUserInfo {
  address?: string;
  name?: string;
  avatarPath?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  id?: number;
}

export interface IOrder {
  user_id: string;
  user_name: string;
  address: string;
  postcode: string;
  phone: string;
  email: string;
  note: string;
  status: string;
  payment_method: string;
  order_list: IOrderItem[];
  discount: number;
  createdAt: Date;
}

export interface IOrderItem {
  id: string;
  colorId: string;
  sizeId: string;
  name: string;
  price: number;
  nameUrlImage: string[];
  quantity: number;
}

export enum EOrderStatus {
  NEW_ORDER = 'NEW_ORDER',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
