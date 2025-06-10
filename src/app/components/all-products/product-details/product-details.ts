import { ChangeDetectorRef, Component, inject, model, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleriaModule } from 'primeng/galleria';
import { Product } from '../../../shared/services/resouce-api-product';
import { IProduct, IProductResponse } from '../../../shared/interfaces/product.interface';
import { RatingModule } from 'primeng/rating';
import { CurrencyPipe } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-details',
  imports: [GalleriaModule, FormsModule, ReactiveFormsModule,RatingModule,CurrencyPipe, InputNumberModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails implements OnInit {
  position: 'left' | 'right' | 'top' | 'bottom' = 'bottom';
  images: any[] = [];
  productService = inject(Product);
  cdr=inject(ChangeDetectorRef);
  activatedRoute=inject(ActivatedRoute)
  product: IProduct | null = null;
  quantity=model(1);
  productId:number|unknown

 
  responsiveOptions: any[] = [
    {
      breakpoint: '1300px',
      numVisible: 4,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];

  async ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.productId = params['id']; 
    })
    await  this.getProductDetails();
    this.cdr.detectChanges();
  }

  async getProductDetails() {
    if(this.productId){
   
    let apiResponse = await this.productService.getProductById(this.productId as number) as IProduct
    if (apiResponse) {
      this.product = apiResponse
      this.images = this.product.images
    }
  }
}


}
