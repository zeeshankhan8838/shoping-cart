import { Component, inject, input, output, signal } from '@angular/core';
import { IProduct } from '../../../shared/interfaces/product.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { DEFAULT_PLACEHOLDER_IMAGE, PRODUCT_CONSTANTS } from '../../../shared/constants/product.constant';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../shared/services/product';

@Component({
  selector: 'app-product-list-view',
  imports: [CommonModule, CurrencyPipe,RatingModule,FormsModule],
  templateUrl: './product-list-view.html',
  styleUrl: './product-list-view.scss'
})
export class ProductListView {
  productService=inject(Product)
  /** Event emitter for product selection */
  productItemId = output<number>();

  /** Input property for product list */
  allProducts = input<IProduct[]>();

  loading = input(true);

  /**
   * Checks if the product has low stock status
   * @param {string} stock - The stock status of the product
   * @returns {boolean} True if stock is low, false otherwise
   */
  isLowStock(stock: string): boolean {
    return stock === PRODUCT_CONSTANTS.STOCK_STATUS.LOW;
  }

  /**
   * Checks if the product belongs to beauty category
   * @param {string} category - The category of the product
   * @returns {boolean} True if product is in beauty category
   */
  isBeautyCategory(category: string): boolean {
    return category === PRODUCT_CONSTANTS.CATEGORIES.BEAUTY;
  }
  
 /**
   * Handles image loading errors by setting a fallback image
   * @param {Event} event - Image error event
   */
  handleImageError(event: Event): void {
    this.productService.handleImageError(event)
  
  }
}
