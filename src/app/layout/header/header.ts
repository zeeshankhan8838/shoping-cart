import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, model, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../shared/services/resouce-api-product';
import { RouterModule } from '@angular/router';
import { CartService } from '../../shared/services/cart';
import { Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit, OnDestroy {
   // Injected services
  private readonly productService = inject(Product);
  private readonly cartService = inject(CartService);
  private readonly destroy$ = new Subject<void>();

  // Component state
  readonly searchText = model('');
  readonly cartTotalItem = signal<number>(0);

  /**
   * Initializes cart subscription on component load
   */
  ngOnInit(): void {
    this.initializeCartSubscription();
  }

  /**
   * Updates search text in product service
   */
  searchTextChange(): void {
    this.productService.searchText$.next(this.searchText());
  }

  /**
   * Subscribes to cart updates and updates total items
   */
  private initializeCartSubscription(): void {
    this.cartService.cartAction$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const totalItems = this.cartService.groupedCartItemsArray().length;
        this.cartTotalItem.set(totalItems);
      });
  }

  /**
   * Cleanup subscriptions on component destroy
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}