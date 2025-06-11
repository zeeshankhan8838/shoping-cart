import { ChangeDetectorRef, Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleriaModule } from 'primeng/galleria';
import { Product } from '../../../shared/services/resouce-api-product';
import { IProduct, IProductResponse, ProductDetailResponse, ResponsiveOption } from '../../../shared/interfaces/product.interface';
import { RatingModule } from 'primeng/rating';
import { CurrencyPipe } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { ActivatedRoute } from '@angular/router';
import { Cart } from '../../cart/cart';
import { CartService } from '../../../shared/services/cart';
import { MessageService } from 'primeng/api';
import { ICartItem } from '../../../shared/interfaces/cart.interface';
import { DEFAULT_PRODUCT_VALUE } from '../../../shared/constants/cart.constant';
import { catchError, EMPTY, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-product-details',
  imports: [GalleriaModule, FormsModule, ReactiveFormsModule, RatingModule, CurrencyPipe, InputNumberModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit {
  // Injected services
  private readonly productService = inject(Product);
  private readonly route = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);
  private readonly messageService = inject(MessageService);

  // Component state
  position: 'left' | 'right' | 'top' | 'bottom' = 'bottom';
  product=signal({} as ICartItem);
  quantity = model(1);
  productId: number | null = null;

  // Gallery configuration
  readonly responsiveOptions: ResponsiveOption[] = [
    {
      breakpoint: '1300px',
      numVisible: 4
    },
    {
      breakpoint: '575px',
      numVisible: 1
    }
  ];

  // Add destroy$ subject for cleanup
  private readonly destroy$ = new Subject<void>();

  /**
  * Initializes component and fetches product details
  */
  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      map(params => Number(params['id'])),
      tap(id => this.productId = id),
      switchMap(() => this.loadProductDetails())
    ).subscribe();
  }

  /**
   * Fetches and sets product details
   */
  private loadProductDetails(): Observable<ICartItem> {
    if (!this.productId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid product ID'
      });
      return EMPTY;
    }

    return this.productService.getProductById(this.productId).pipe(
      tap((apiResponse: ICartItem) => {
        if (apiResponse) {
          this.initializeProduct(apiResponse);
        }
      }),
      catchError(error => {
        this.productService.showErrorToastMessage(error, 'Failed to load product details')
        return EMPTY;
      })
    );
  }

  
  /**
   * Adds current product to cart
   */
  addToCart(): void {
    if (!this.product()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Product details not available'
      });
      return;
    }

    try {
      this.cartService.addProductToCart(this.product());
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Product Added to Cart'
      });
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add product to cart'
      });
    }
  }

  /**
   * Updates quantity and recalculates price
   */
  quantityChange(): void {
    if (!this.product) return;

    const stock = Number(this.product().stock) || 0;
    const quantity = Number(this.product().updatedQuantity) || 0;

    if (stock <= 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Product out of stock'
      });
      return;
    }

    if (stock >= quantity) {
      this.product().remainingStock = stock - quantity;
    } else {
      this.product().updatedQuantity = 1;
      this.product().remainingStock = stock - 1;
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Quantity exceeds available stock'
      });
    }

    this.cartService.calculatePrice(this.product());
  }

  /**
   * Initializes product with default values and API response
   */
  private initializeProduct(apiResponse: ICartItem): void {
    this.product .set({
      ...DEFAULT_PRODUCT_VALUE,
      ...apiResponse,
      totalPrice: apiResponse.price,
      remainingStock: apiResponse.stock,
      images: apiResponse.images
    });
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
