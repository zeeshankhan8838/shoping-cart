import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, Observable, Subject, throwError } from 'rxjs';
import { apiEndpoints } from '../constants/endpoints';
import { DEFAULT_PLACEHOLDER_IMAGE } from '../constants/product.constant';
import { ApiError } from '../interfaces/api-base-action.inteface';
import { ICartItem } from '../interfaces/cart.interface';
import { IProductResponse as ProductResponse } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class Product {
  private http = inject(HttpClient);
  searchText$: Subject<string> = new Subject();
  messageService=inject(MessageService)

  getallProducts(skip: number, limit: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(apiEndpoints.allProducts, {
      params: { skip: skip.toString(), limit: limit.toString() }
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getProductById(id: number): Observable<ICartItem> {
    return this.http.get<ICartItem>(apiEndpoints.getProductById(id)).pipe(
      catchError(error => this.handleError(error))
    );
  }

  getSearchResults(query: string): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(apiEndpoints.searchProducts(query)).pipe(
      catchError(error => this.handleError(error))
    );
  }

   private handleError(error: HttpErrorResponse): Observable<never> {
    const apiError: ApiError = {
      message: error.error?.message || 'An unknown error occurred',
      status: error.status,
      timestamp: new Date()
    };
    return throwError(() => apiError);
  }

  showErrorToastMessage(error: ApiError, summary: string): void {
    return this.messageService.add({
      severity: 'error',
      summary,
      detail: error.message
    });
  }

   /**
   * Handles image loading errors by setting a fallback image
   * @param {Event} event - Image error event
   */
  handleImageError(event: Event): void {
    if (!event.target) return;
    
    const imgElement = event.target as HTMLImageElement;
    imgElement.onerror = null; // Prevent infinite loop
    imgElement.src = DEFAULT_PLACEHOLDER_IMAGE;
    
    console.warn(`Image load failed, using placeholder: ${imgElement.alt}`);
  }
}