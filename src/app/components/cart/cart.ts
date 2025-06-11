import { CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InputNumberModule } from 'primeng/inputnumber';
import { Subscription } from 'rxjs';
import { ICartItem } from '../../shared/interfaces/cart.interface';
import { CartService } from '../../shared/services/cart';
import { COUPON_CODE } from '../../shared/constants/cart.constant';

@Component({
  selector: 'app-cart',
  imports: [InputNumberModule, FormsModule, ReactiveFormsModule, CurrencyPipe, RouterModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit {
  // Injected Services
  private readonly cartService = inject(CartService);
  private readonly cdr = inject(ChangeDetectorRef);

  // Component State
  private readonly cartSubscription = new Subscription();
  groupedCartItemsArray = this.cartService.getCartFilterList();
  $groupIndex = 0;
  coupon=model('')
  isCouponDisable=signal(false)

  // Computed Values
  readonly calculatedAmountSummary = this.cartService.calculatedAmount;

  /**
   * Initializes cart and calculates total amount
   */
  ngOnInit(): void {
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray);
  }

  /**
   * Handles selection of all cart items
   * @param event Checkbox change event
   */
  selectAllItems(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.cartService.selectAllItems(this.groupedCartItemsArray, checked);
    this.updateCartTotals();
  }

  /**
   * Removes a specific item from cart
   */
  deleteSubItem(): void {
    this.groupedCartItemsArray.splice(this.$groupIndex, 1);
    this.updateCartState('delete');
  }

  /**
   * Removes all items from cart
   */
  deleteAllItems(): void {
    if (!this.groupedCartItemsArray.length) return;

    this.cartService.deleteProductIntoCart();
    this.refreshCartList();
  }

  /**
   * Updates cart when item quantity changes
   * @param item Changed cart item
   */
  quantityChange(item: ICartItem): void {
    this.cartService.calculatePrice(item);
    this.updateCartTotals();
  }

  /**
   * Handles item selection changes
   */
  checkboxChange(): void {
    this.updateCartState();
  }

  /**
   * Checks if checkout should be enabled
   */
  get isCheckoutEnabled(): boolean {
    return !this.groupedCartItemsArray.some(x => x.isSelected);
  }

  /**
   * Returns count of selected items
   */
  get selectedItemCount(): number {
    return this.groupedCartItemsArray.filter(x => x.isSelected).length;
  }

  /**
   * Updates cart state and totals
   */
  private updateCartState(action?: 'delete'): void {
    this.cartService.updateGroupCartList(this.groupedCartItemsArray);
    this.updateCartTotals();
    if (action) {
      this.cartService.cartAction$.next(action);
    }
  }

  /**
   * Updates cart totals
   */
  private updateCartTotals(): void {
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray);
    this.cdr.detectChanges();
  }

  /**
   * Refreshes cart list data
   */
  private refreshCartList(): void {
    this.groupedCartItemsArray = this.cartService.getCartFilterList();
    this.updateCartState('delete');
  }

  couponChange(){
    this.coupon()==COUPON_CODE? this.isCouponDisable.set(true):this.isCouponDisable.set(false)
  }

  /**
   * Cleanup subscriptions
   */
  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe();
  }
}