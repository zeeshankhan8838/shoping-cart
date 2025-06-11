import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',
        loadComponent: () => import('./components/all-products/all-products').then(m => m.AllProducts)
    },
    {
        path:'product-details/:id',
        loadComponent: () => import('./components/all-products/product-details/product-details').then(m => m.ProductDetails)
    },
    {
        path:'cart',
        loadComponent: () => import('./components/cart/cart').then(m => m.Cart)
    },
    {
        path:'checkout',
        loadComponent:()=> import('./components/checkout/checkout').then(m=>m.Checkout)
    }
];
