import { Component, inject, Input, input, output } from '@angular/core';
import { IProduct } from '../../../shared/interfaces/product.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Product } from '../../../shared/services/resouce-api-product';

@Component({
  selector: 'app-product-grid-view',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-grid-view.html',
  styleUrl: './product-grid-view.scss'
})
export class ProductGridView {
  private readonly productService = inject(Product);

  /** Input signal containing array of products to display */
  readonly allProducts = input<IProduct[]>([]);

  /** Output signal emitting selected product ID */
  readonly productItemId = output<number>();

  /**
   * Handles image loading errors by setting a fallback image
   * Delegates to product service for consistent error handling
   * @param {Event} event - DOM event from failed image load
   */
  handleImageError(event: Event): void {
    this.productService.handleImageError(event);
  }
}
