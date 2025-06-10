import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../shared/services/resouce-api-product';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  searchText = model('')
  productService = inject(Product)

  searchTextChange() {
    this.productService.searchText$.next(this.searchText())
  }
}
