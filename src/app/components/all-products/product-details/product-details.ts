import { ChangeDetectorRef, Component, inject, model, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleriaModule } from 'primeng/galleria';
import { Product } from '../../../shared/services/resouce-api-product';
import { IProduct, IProductResponse } from '../../../shared/interfaces/product.interface';
import { RatingModule } from 'primeng/rating';
import { CurrencyPipe } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { ActivatedRoute } from '@angular/router';
import { Cart } from '../../cart/cart';
import { CartService } from '../../../shared/services/cart';
import { MessageService } from 'primeng/api';
import { ICartItem } from '../../../shared/interfaces/cart.interface';
import { DEFAULT_PRODUCT_VALUE } from '../../../shared/constants/cart.constant';

@Component({
  selector: 'app-product-details',
  imports: [GalleriaModule, FormsModule, ReactiveFormsModule, RatingModule, CurrencyPipe, InputNumberModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit {
  position: 'left' | 'right' | 'top' | 'bottom' = 'bottom';
  productService = inject(Product);
  cdr = inject(ChangeDetectorRef);
  activatedRoute = inject(ActivatedRoute)
  cartService = inject(CartService)
  messageService = inject(MessageService)
  product: ICartItem = {} as ICartItem;
  quantity = model(1);
  productId: number | unknown


  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];

  async ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.productId = params['id'];
    })
    await this.getProductDetails();
    this.cdr.detectChanges();
  }

  async getProductDetails() {
    if (this.productId) {

      let apiResponse = await this.productService.getProductById(this.productId as number) as ICartItem
      if (apiResponse) {
        this.product = {
          ...DEFAULT_PRODUCT_VALUE,
          ...apiResponse,
          totalPrice: apiResponse.price,
          remainingStock: apiResponse.stock,
          images: apiResponse.images,
        };
      }
    }
  }

  addToCart() {
    this.cartService.addProductToCart(this.product as IProduct)
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product Added in Cart' });
  }

  quantityChange() {
    if (Number(this.product?.stock) > Number(this.product?.quantity)) {
      this.product.remainingStock = Number(this.product?.stock) - Number(this.product?.updatedQuantity)
    } else {
      this.product.updatedQuantity = 1
      this.product.remainingStock = this.product.stock -1
    }
    this.cartService.calculatePrice(this.product as ICartItem)
  }


}
