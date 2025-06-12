import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CartService } from '../../shared/services/cart';
import { IGroupedCartItems } from '../../shared/interfaces/cart.interface';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { PROMO_CODE } from '../../shared/constants/cart.constant';

@Component({
  selector: 'app-checkout',
  imports: [InputNumberModule, FormsModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {
  // Injected services
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();

  // Component state
  readonly calculatedAmountSummary = this.cartService.calculatedAmount;
  readonly groupedCartItemsArray = signal<IGroupedCartItems[]>([]);
  promoCode=model('')
  isPromoCodeDisable=signal(false) 
  
  // Date calculations
  readonly currentDate = new Date();
  readonly expectedDate = new Date();
  
  // Track selected group index
  $groupIndex = 0;

  /**
   * Initializes component and loads cart data
   */
  ngOnInit(): void {
    this.initializeDeliveryDate();
    this.loadCartData();
  }

  /**
   * Processes payment and places order
   */
  pay(): void {
    if (!this.validateOrder()) return;

    this.messageService.add({ 
      severity: 'success', 
      summary: 'Success', 
      detail: 'Your Order has been placed' 
    });
    this.cartService.updateGroupCartList([])
    this.router.navigate(['/']);
  }

  /**
   * Removes item from cart
   * @param index Index of item to remove
   */
  deleteItem(index: number): void {
    this.$groupIndex = index;
    const currentItems = this.groupedCartItemsArray();
    
    if (index >= 0 && index < currentItems.length) {
      currentItems.splice(index, 1);
      this.updateCart(currentItems);
    }
  }



  /**
   * Private helper methods
   */
  private initializeDeliveryDate(): void {
    this.expectedDate.setDate(this.currentDate.getDate() + 7);
  }

  private loadCartData(): void {
    const cartItems = this.cartService.getCartFilterList();
    this.groupedCartItemsArray.set(cartItems);
    this.cartService.getTotalAmountSummary(cartItems);
  }

  private updateCart(items: IGroupedCartItems[]): void {
    this.groupedCartItemsArray.set(items);
    this.cartService.updateGroupCartList(items);
    this.cartService.getTotalAmountSummary(items);
  }

  private validateOrder(): boolean {
    const items = this.groupedCartItemsArray();
    if (!items.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Your cart is empty'
      });
      return false;
    }
    return true;
  }

   promoCodeChange(){
      this.promoCode()==PROMO_CODE? this.isPromoCodeDisable.set(true):this.isPromoCodeDisable.set(false)
    }

      /**
   * Cleanup subscriptions
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
}