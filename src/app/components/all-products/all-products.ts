import { CommonModule } from '@angular/common';
import { Component, inject, input, model, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { SelectButton } from 'primeng/selectbutton';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { ERROR_MESSAGES, LAYOUT_TYPES } from '../../shared/constants/product.constant';
import { ApiError } from '../../shared/interfaces/api-base-action.inteface';
import { IProduct, IProductResponse } from '../../shared/interfaces/product.interface';
import { Product } from '../../shared/services/product';
import { ProductGridView } from "./product-grid-view/product-grid-view";
import { ProductListView } from "./prouct-list-view/product-list-view";

@Component({
  selector: 'app-all-products',
  imports: [ProductListView, ProductGridView, SelectButton, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule, RouterModule],
  templateUrl: './all-products.html',
  styleUrl: './all-products.scss'
})
export class AllProducts implements OnInit, OnDestroy {
  // Injected services
  private readonly productService = inject(Product);
  private readonly router = inject(Router);

  // Signals and state
  readonly productList = signal<IProduct[]>([]);
  readonly layout = model<'grid' | 'list'>('grid');
  readonly isLoading = signal(false);
  readonly skip = signal(0);
  readonly limit = signal(10);
  readonly totalRecords = signal(0);
  readonly paginationPageOption = signal([10, 20, 30]);
  loading = signal(true)

  // Constants
  private readonly destroy$ = new Subject<void>();
  options = signal(['list', 'grid']);

  /**
     * Determines if the current layout is grid view
     * @returns {boolean} True if current layout is grid, false otherwise
     */
  isListView(): boolean {
    return this.layout() === LAYOUT_TYPES.LIST;
  }

  /**
    * Lifecycle hook that initializes product list and search subscription
    */
  ngOnInit(): void {
    this.getAllProductList();
    this.initializeSearchSubscription();

  }

  /**
    * Fetches all products based on current pagination settings
    * Updates product list and total records on successful response
    */
  getAllProductList(): void {
    this.productService.getallProducts(this.skip(), this.limit())
      .pipe(takeUntil(this.destroy$),
        finalize(() => this.loading.set(false))
      )

      .subscribe({
        next: (response: IProductResponse) => this.updateProductList(response),
        error: (error: ApiError) => {
          this.productService.showErrorToastMessage(error, ERROR_MESSAGES.LOAD_FAILED)
        }
      });
  }

  /**
    * Initializes search subscription with debouncing and distinct check
    * Switches between search and getAll based on search text
    * @private
    */
  private initializeSearchSubscription(): void {
    this.productService.searchText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchText: string) =>
          searchText
            ? this.productService.getSearchResults(searchText)
            : this.productService.getallProducts(this.skip(), this.limit())
        ),
          finalize(() => this.loading.set(false)),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response: IProductResponse) => this.updateProductList(response),
        error: (error: ApiError) => {
          this.productService.showErrorToastMessage(error, ERROR_MESSAGES.SEARCH_FAILED)
        }
      });
  }

  /**
     * Updates the product list and total records signals with API response
     * @param {IProductResponse} response - The API response containing products and total
     * @private
     */
  private updateProductList(response: IProductResponse): void {
    if (response?.products) {
      this.productList.set(response.products);
      this.totalRecords.set(response.total);
    }
  }


  /**
   * Handles pagination state changes
   * Updates skip and limit signals and fetches new product list
   * @param {PaginatorState} event - The paginator state containing page info
   */
  onPageChange(event: PaginatorState): void {
      this.loading.set(true);
    this.skip.set(event.first ?? 0);
    this.limit.set(event.rows ?? 10);
    this.getAllProductList();
  }


  /**
   * Navigates to product details page
   * @param {number} id - The product ID to navigate to
   */
  navigateById(id: number): void {
    this.router.navigate(['/product-details', id]);
  }


  /**
     * Returns the appropriate icon class based on layout type
     * @param {string} item - The layout type ('list' or 'grid')
     * @returns {string} The CSS class for the icon
     */
  getActiveClass(item: string): string {
    return item === LAYOUT_TYPES.LIST ? 'fa-bars' : 'fa-table';

  }

  /**
   * Lifecycle hook for cleanup
   * Completes and cleans up subscriptions
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
