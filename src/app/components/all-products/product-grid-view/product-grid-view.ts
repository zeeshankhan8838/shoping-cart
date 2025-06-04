import { Component, Input, input } from '@angular/core';
import { IProduct } from '../../../shared/interfaces/product.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-grid-view',
  imports: [CommonModule,CurrencyPipe],
  templateUrl: './product-grid-view.html',
  styleUrl: './product-grid-view.scss'
})
export class ProductGridView {
allProducts=input<IProduct[]>()
}
