import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, model, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../shared/services/resouce-api-product';
import { RouterModule } from '@angular/router';
import { CartService } from '../../shared/services/cart';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {
  searchText = model('')
  productService = inject(Product)
  cartService=inject(CartService)
  carttotalItem=signal(0)
  cartSubscription:Subscription=new Subscription()
 

  constructor(){
    
  }

  ngOnInit(){ 
    this.getCartList()
  }

  searchTextChange() {
    this.productService.searchText$.next(this.searchText())
  }

  getCartList(){
   this.cartSubscription= this.cartService.cartAction$.subscribe(response=>{
      this.carttotalItem.set(response.length)
    })
  }

  ngOnDestroy(): void {
    this.cartSubscription.unsubscribe()
  }
}
