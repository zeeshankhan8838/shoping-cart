import { ChangeDetectorRef, Component, inject, model, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CartService } from '../../shared/services/cart';
import { Subscription } from 'rxjs';
import { IProduct } from '../../shared/interfaces/product.interface';
import { CurrencyPipe } from '@angular/common';
import { ICartItem, IGroupedCartItems } from '../../shared/interfaces/cart.interface';

@Component({
  selector: 'app-cart',
  imports: [InputNumberModule, FormsModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  cartService = inject(CartService)
  cartSubscription: Subscription = new Subscription()
  groupedCartItemsArray = signal([] as IGroupedCartItems[])
  $groupIndex: number = 0;
  cdr = inject(ChangeDetectorRef)
  calculatedAmountSummary = this.cartService.calculatedAmount

  ngOnInit(): void {
    this.groupedCartItemsArray.set(this.cartService.getCartFilterList())
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray())
  }


  selectAllItems(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.cartService.selectAllItems(this.groupedCartItemsArray(), checked)
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray())

  }

  deleteSubItem() {
    this.groupedCartItemsArray().splice(this.$groupIndex, 1)
    this.cartService.deleteProductIntoCart()
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray())
  }

  deleteAllItems() {
    this.groupedCartItemsArray.set([])
    this.cartService.deleteProductIntoCart()
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray())
  }

  quantityChange(item: ICartItem) {
    this.cartService.calculatePrice(item)
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray())
  }

  checkboxChange() {
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray())

  }

}
