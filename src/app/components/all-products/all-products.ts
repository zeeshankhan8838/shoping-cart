import { ChangeDetectorRef, Component, inject, model } from '@angular/core';
import { ProuctListView } from "./prouct-list-view/prouct-list-view";
import { ProductGridView } from "./product-grid-view/product-grid-view";
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../shared/services/resouce-api-product';
import { IProduct } from '../../shared/interfaces/product.interface';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ProductDetails } from "./product-details/product-details";
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-all-products',
  imports: [ProuctListView, ProductGridView, SelectButton, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule, RouterModule],
  templateUrl: './all-products.html',
  styleUrl: './all-products.scss'
})
export class AllProducts {
  productService = inject(Product)
  cdr = inject(ChangeDetectorRef)
  router = inject(Router)
  productList: IProduct[] = [];
  layout = model('grid')
  options = ['list', 'grid'];
  skip: number = 0;
  limit: number = 10;
  totalRecords: number = 0;
  paginationPageOption = [10, 20, 30]
  searchSubscription: Subscription = new Subscription();

  isGridView() {
    return this.layout() === 'grid';
  }

  async ngOnInit() {
    await this.getAllProductList();
    this.onSearchTextChange()

  }

  async getAllProductList() {
    let apiResponse = (await this.productService.getallProducts(this.skip, this.limit))
    this.productList = apiResponse.products;
    this.totalRecords = apiResponse.total;
    this.cdr.detectChanges()
  }



  onPageChange(event: PaginatorState) {
    this.skip = event.first ?? 0;
    this.limit = event.rows ?? 10;
    this.getAllProductList();
  }

  navigateById(id: number) {
    this.router.navigate(['/product-details', id]);
  }

  onSearchTextChange() {
    this.searchSubscription = this.productService.searchText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchText) => {
          if (searchText) {
            return this.productService.getSearchResults(searchText);
          } else {
            return this.productService.getallProducts(this.skip, this.limit);
          }
        })
      )
      .subscribe((apiResponse: any) => {
        if (apiResponse && apiResponse.products) {
          this.productList = apiResponse.products;
          this.totalRecords = apiResponse.total;
        }
        this.cdr.detectChanges();
      });
  }

  async getSearchResults(query: string) {
    if (!query) {
      return
    }
    let apiResponse = (await this.productService.getSearchResults(query))
    this.productList = apiResponse.products;
    this.totalRecords = apiResponse.total;
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }

}
