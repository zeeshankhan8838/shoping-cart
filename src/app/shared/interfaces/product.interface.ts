import { ICartItem } from "./cart.interface";

export interface IDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface IReview {
  rating: number;
  comment: string;
  date: string; // ISO date string
  reviewerName: string;
  reviewerEmail: string;
}

export interface IMeta {
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  barcode: string;
  qrCode: string;
}

export interface IProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: IDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: IReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: IMeta;
  images: string[];
  thumbnail: string;
}

export interface IProductResponse {
  products: IProduct[];
  total: number;
  skip: number;
  limit: number;
}

// Define the ResponsiveOption type for gallery options
 export  interface ResponsiveOption {
    breakpoint: string;
    numVisible: number;
  }

  export interface ProductDetailResponse {
  products: ICartItem;
  total: number;
  skip: number;
  limit: number;
}