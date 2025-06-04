import { Component, model } from '@angular/core';
import { ProuctListView } from "./prouct-list-view/prouct-list-view";
import { ProductGridView } from "./product-grid-view/product-grid-view";
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-products',
  imports: [ProuctListView, ProductGridView,SelectButton,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './all-products.html',
  styleUrl: './all-products.scss'
})
export class AllProducts {
      layout=model('grid')

      options = ['list', 'grid'];


      isGridView() {
        return this.layout() === 'grid';
      }
}
