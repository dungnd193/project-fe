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
