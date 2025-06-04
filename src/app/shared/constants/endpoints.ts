import { environment } from "../../../environments/environments";

export const apiEndpoints = {
    allProducts: 'products',
    getProductById: (id: string) => `products/${id}`,
    searchProducts: (query: string) => `products/search?q=${query}`,

}