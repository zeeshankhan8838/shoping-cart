import { environment } from "../../../environments/environments";

export const apiEndpoints = {
    allProducts: `${environment.apiURL}products`,
    getProductById: (id: number) => `${environment.apiURL}products/${id}`,
    searchProducts: (query: string) => `${environment}products/search?q=${query}`,
}

