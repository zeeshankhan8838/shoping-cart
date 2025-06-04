import { Component, input } from '@angular/core';
import { IProduct } from '../../../shared/interfaces/product.interface';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-prouct-list-view',
  imports: [CommonModule,CurrencyPipe],
  templateUrl: './prouct-list-view.html',
  styleUrl: './prouct-list-view.scss'
})
export class ProuctListView {
allProducts=input<IProduct[]>()

isLowStock(stock:string ): boolean {
    return stock==='Low Stock'
}
isBeautyCategory(category: string): boolean {
    return category === 'beauty';
}
}
