import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CartService } from '../../shared/services/cart';
import { IGroupedCartItems } from '../../shared/interfaces/cart.interface';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [InputNumberModule, FormsModule, ReactiveFormsModule, CurrencyPipe, DatePipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class Checkout implements OnInit {
  cartService = inject(CartService)
  messageService = inject(MessageService)
  router = inject(Router)
  calculatedAmountSummary = this.cartService.calculatedAmount
  groupedCartItemsArray = signal([] as IGroupedCartItems[])
  currentDate = new Date()
  expectedDate = new Date();
  $groupIndex: any;


  ngOnInit(): void {
    this.expectedDate.setDate(this.currentDate.getDate() + 7);
    this.groupedCartItemsArray.set(this.cartService.getCartFilterList())
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray())
  }


  pay() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Your Order has been placed' });
    this.router.navigate(['/'])
  }

  deleteItem() {
    this.groupedCartItemsArray().splice(this.$groupIndex, 1)
    this.cartService.updateGroupCartList(this.groupedCartItemsArray())
    this.cartService.getTotalAmountSummary(this.groupedCartItemsArray())
    this.cartService.cartAction$.next('delete')
  }
}
