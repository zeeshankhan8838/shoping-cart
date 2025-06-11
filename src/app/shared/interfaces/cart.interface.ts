import { IProduct } from "./product.interface";

export type cartActionType = 'add' | 'update' | 'delete' | 'get'

export interface ICartItem extends IProduct {
  isSelected: boolean;
  quantity: number;
  totalPrice: number
  remainingStock: number
  deliveryFee: number
  updatedQuantity:number
}
// Represents a group of products by their id
export interface IGroupedCartItems {
  id: string | number;      // Product ID (type depends on your product model)
  items: ICartItem[];
  brand: string
  isSelected: boolean
}

