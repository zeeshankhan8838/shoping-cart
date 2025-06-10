import { Injectable, signal } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { Subject } from 'rxjs';
import { cartActionType, ICartItem, IGroupedCartItems } from '../interfaces/cart.interface';
import { CalculatedAmountSummary } from '../model/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartList: IProduct[] = []
  calculatedAmount = new CalculatedAmountSummary()
  cartAction$: Subject<IProduct[]> = new Subject()

  constructor() { }

  addProductToCart(cart: IProduct) {
    this.cartList.push(cart)
    this.cartAction$.next(this.cartList)
  }

  deleteProductIntoCart() {
    this.cartList = []
    this.cartAction$.next(this.cartList)
  }


  groupItemsByIdArray() {
    const grouped: { [id: string]: ICartItem[] } = {};
    for (const item of this.cartList) {
      if (!grouped[item.id]) {
        grouped[item.id] = [];
      }
      grouped[item.id].push(item as ICartItem);
    }
    // Convert object to array for *ngFor
    return Object.keys(grouped).map(id => ({
      id,
      items: grouped[id],
      brand: grouped[id][0].brand || ''
    }));
  }

  getCartFilterList(): IGroupedCartItems[] {
    const groupedItems = this.groupItemsByIdArray();

    return groupedItems.map(group => {
      const combinedItem = group.items.reduce((acc, item) => {
        const quantity = item.quantity || 1;
        return {
          ...item,
          price: (acc.price || 0) + (item.price * quantity),
          quantity: (acc.quantity || 0) + quantity,
          isSelected: acc.isSelected || item.isSelected
        };
      }, {} as ICartItem);

      return {
        id: group.id,
        brand: group.brand,
        items: [combinedItem],
        isSelected: false
      };
    });
  }

  calculatePrice(item: ICartItem) {
    item.totalPrice = Number(item.price) * Number(item.quantity)
  }

  getTotalAmountSummary(array: IGroupedCartItems[]) {
    let subTotal = 0;
    for (const group of array) {
      if(group.isSelected){
      for (const item of group.items) {
        subTotal += Number(item.totalPrice) || 0;
      }
    }
    }
    this.calculatedAmount.subTotalAmount = subTotal;
    this.calculatedAmount.shippingAmount = 200;
    this.calculatedAmount.totalAmount = subTotal + this.calculatedAmount.shippingAmount;
  }

  selectAllItems(array: IGroupedCartItems[], checked: boolean) {
    for (const element of array) {
      element.isSelected = checked || false
      for (const subItem of element.items) {
        subItem.isSelected = checked || false

      }
    }
  }

}
