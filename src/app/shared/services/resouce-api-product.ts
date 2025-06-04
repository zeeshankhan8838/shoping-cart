import { Injectable, Resource, resource } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Product {

  productList!: Resource<any>;
  constructor() { }



  getAllProducts() {
    this.productList = resource({
      loader: async () => {
        const response = await fetch(`https://api.example.com/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        return (await response.json()) as any;
      },
    });
  }
  
  getProductById(id: string) {
    return resource({
      loader: async () => {
        const response = await fetch(`https://api.example.com/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        return (await response.json()) as any;
      },
    });
  }


}
