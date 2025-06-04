import { ChangeDetectorRef, Component, inject, model } from '@angular/core';
import { ProuctListView } from "./prouct-list-view/prouct-list-view";
import { ProductGridView } from "./product-grid-view/product-grid-view";
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../shared/services/resouce-api-product';
import { IProduct } from '../../shared/interfaces/product.interface';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-all-products',
  imports: [ProuctListView, ProductGridView, SelectButton, CommonModule, FormsModule, ReactiveFormsModule, PaginatorModule],
  templateUrl: './all-products.html',
  styleUrl: './all-products.scss'
})
export class AllProducts {
  productService = inject(Product)
  cdr = inject(ChangeDetectorRef)
  productList: IProduct[] = [];
  layout = model('grid')
  options = ['list', 'grid'];
  skip: number = 0;
  limit: number = 10;
  totalRecords: number = 0;
  paginationPageOption = [10, 20, 30]

  isGridView() {
    return this.layout() === 'grid';
  }

  async ngOnInit() {
    await this.getAllProductList();

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

}
