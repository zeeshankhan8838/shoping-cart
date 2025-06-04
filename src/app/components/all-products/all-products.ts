import { ChangeDetectorRef, Component, inject, model } from '@angular/core';
import { ProuctListView } from "./prouct-list-view/prouct-list-view";
import { ProductGridView } from "./product-grid-view/product-grid-view";
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../shared/services/resouce-api-product';
import { IProduct } from '../../shared/interfaces/product.interface';

@Component({
  selector: 'app-all-products',
  imports: [ProuctListView, ProductGridView, SelectButton, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './all-products.html',
  styleUrl: './all-products.scss'
})
export class AllProducts {
  productService = inject(Product)
  cdr = inject(ChangeDetectorRef)
  productList: IProduct[] = [];
  layout = model('grid')

  options = ['list', 'grid'];


  isGridView() {
    return this.layout() === 'grid';
  }

  async ngOnInit() {
    await this.getAllProductList();

  }

  async getAllProductList() {
    this.productList = (await this.productService.getallProducts())
    this.cdr.detectChanges()
  }

}
