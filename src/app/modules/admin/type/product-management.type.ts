export interface IProduct {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  priceOut?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  urlImage?: string;
  subImage?: string[];
  rating?: number;
  multipartFile?: string;
  color?: string;
  brand?: string;
  size?: string;
  countBuy?: number;
  discount?: string;
  categoryDto?: {
    id?: number;
    name?: string;
  };
}
export interface ICategories {
  id: string;
  name: string;
}

export interface IColors {
  id: string;
  name: string;
  code: string;
}

export interface ISizes {
  id: string;
  name: string;
}

export interface IDetailRow {
  color: IColors;
  size: ISizes;
  quantity: number;
}
