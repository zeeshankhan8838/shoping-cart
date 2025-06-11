import { CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
import { Subscription } from 'rxjs';
import { ICartItem } from '../../shared/interfaces/cart.interface';
import { CartService } from '../../shared/services/cart';

@Component({
  selector: 'app-cart',
  imports: [InputNumberModule, FormsModule, ReactiveFormsModule, CurrencyPipe, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  cartService = inject(CartService)
  cartSubscription: Subscription = new Subscription()
  groupedCartItemsArray = this.cartService.getCartFilterList()
  $groupIndex: number = 0;
  cdr = inject(ChangeDetectorRef)
  calculatedAmountSummary = this.cartService.calculatedAmount

  ngOnInit(): void {
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray)
  }


  selectAllItems(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.cartService.selectAllItems(this.groupedCartItemsArray, checked)
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray)

  }

  deleteSubItem() {
    this.groupedCartItemsArray.splice(this.$groupIndex, 1)
    this.cartService.updateGroupCartList(this.groupedCartItemsArray)
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray)
    this.cartService.cartAction$.next('delete')
  }

  deleteAllItems() {
    if (this.groupedCartItemsArray.length) {
      this.cartService.deleteProductIntoCart()
      this.getCartGroupList()
      this.cartService.getTotalAmountSummary(this.groupedCartItemsArray)
      this.cartService.cartAction$.next('delete')
    }
  }

  quantityChange(item: ICartItem) {
    this.cartService.calculatePrice(item)
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray)
  }

  checkboxChange() {
    this.cartService.updateGroupCartList(this.groupedCartItemsArray)
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray)
  }

  get isCheckoutEnabled() {
    return !this.groupedCartItemsArray.some(x => x.isSelected)
  }

  getCartGroupList() {
    this.groupedCartItemsArray = this.cartService.getCartFilterList()
  }

  get selectedItemCount() {
    return this.groupedCartItemsArray.filter(x => x.isSelected).length
  }

}
