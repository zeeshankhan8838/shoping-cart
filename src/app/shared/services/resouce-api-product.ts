import { inject, Injectable, Resource, resource } from '@angular/core';
import { CrudService } from './crud';
import { apiEndpoints } from '../constants/endpoints';
import { IProductResponse } from '../interfaces/product.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Product {

  crudServuce = inject(CrudService)
  searchText$:Subject<string>=new Subject()
  // productList!: Resource<any>;
  constructor() { }



  // getAllProducts() {
  //   this.productList = resource({
  //     loader: async () => {
  //       const response = await fetch(`https://api.example.com/products`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch product');
  //       }
  //       return (await response.json()) as any;
  //     },
  //   });
  // }

  // getProductById(id: string) {
  //   return resource({
  //     loader: async () => {
  //       const response = await fetch(`https://api.example.com/products/${id}`);
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch product');
  //       }
  //       return (await response.json()) as any;
  //     },
  //   });
  // }

  async getallProducts(skip: number, limit: number) {
    try {
      const apiResponse = await this.crudServuce.get(apiEndpoints.allProducts(skip, limit)) as IProductResponse;
      if (apiResponse) {
        return apiResponse;
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: number) {
    try {
      const apiResponse = await this.crudServuce.get(apiEndpoints.getProductById(id));
      if (apiResponse) {
        return apiResponse;
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  async getSearchResults(query: string) {
    try { 
      const apiResponse = await this.crudServuce.get(apiEndpoints.searchProducts(query)) as IProductResponse;
      if (apiResponse) {
        return apiResponse;
      } else {
        throw new Error('Failed to fetch search results');
      }
    } catch (error) {
      throw error
    }
  }

  async searchProducts(query: string) {
    return await this.crudServuce.get(apiEndpoints.searchProducts(query));
  }

}
