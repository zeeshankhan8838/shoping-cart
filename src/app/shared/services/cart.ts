import { Injectable, signal } from '@angular/core';
import { IProduct } from '../interfaces/product.interface';
import { Subject } from 'rxjs';
import { cartActionType, ICartItem, IGroupedCartItems } from '../interfaces/cart.interface';
import { CalculatedAmountSummary } from '../model/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartList = signal<IProduct[]>([])
  groupedCartItemsArray = signal([] as IGroupedCartItems[])
  calculatedAmount = new CalculatedAmountSummary()
  cartAction$: Subject<cartActionType> = new Subject()

  constructor() { }

  addProductToCart(cart: IProduct) {
    this.cartList.set([...this.cartList(), cart])
    this.groupItemsByIdArray()
    this.cartAction$.next('add')
  }

  deleteProductIntoCart() {
    this.cartList.set([])
    this.groupedCartItemsArray.set([])
    this.cartAction$.next('delete')
  }


  groupItemsByIdArray() {
    const grouped: { [id: string]: ICartItem[] } = {};
    for (const item of this.cartList()) {
      if (!grouped[item.id]) {
        grouped[item.id] = [];
      }
      grouped[item.id].push(item as ICartItem);
    }
    // Convert object to array for *ngFor
    let array = Object.keys(grouped).map(id => ({
      id,
      items: grouped[id],
      brand: grouped[id][0].brand || '',
      isSelected: false
    }));
    this.groupedCartItemsArray.set(array)
    return array
  }

  getCartFilterList(): IGroupedCartItems[] {
    return this.groupedCartItemsArray().map(group => ({
      id: group.id,
      brand: group.brand,
      isSelected: group.isSelected,
      items: [{
        ...group.items[0],
        totalPrice: group.items.reduce((total, item) =>
          total + (item.price * (item.updatedQuantity || 1)), 0),
        updatedQuantity: group.items.reduce((total, item) =>
          total + (item.updatedQuantity || 1), 0),
        isSelected: group.items.some(item => item.isSelected)
      }]
    }));
  }

  calculatePrice(item: ICartItem) {
    item.totalPrice = Number(item.price) * Number(item.updatedQuantity)
  }

  getTotalAmountSummary(array: IGroupedCartItems[]) {
    let subTotal = 0;
    let shippingFee = 0
    for (const group of array) {
      if (group.isSelected) {
        for (const item of group.items) {
          subTotal += Number(item.totalPrice) || 0;
          shippingFee += Number(item.deliveryFee) || 0;
        }
      }
    }
    this.calculatedAmount.subTotalAmount = subTotal;
    this.calculatedAmount.shippingAmount = shippingFee;
    this.calculatedAmount.totalAmount = subTotal + shippingFee;
  }

  selectAllItems(array: IGroupedCartItems[], checked: boolean) {
    for (const element of array) {
      element.isSelected = checked || false
      for (const subItem of element.items) {
        subItem.isSelected = checked || false
      }
    }
    this.groupedCartItemsArray.set(array)
  }

  updateGroupCartList(array: IGroupedCartItems[]) {
    this.groupedCartItemsArray.update(() => array);
    this.cartAction$.next('update')
  }
}
