import { environment } from "../../../environments/environments";

const BASE_URL = environment.apiURL;

interface ProductEndpoints {
  allProducts: string;
  getProductById: (id: number) => string;
  searchProducts: (query: string) => string;
}

export const apiEndpoints: ProductEndpoints = {
  allProducts: `${BASE_URL}products`,
  getProductById: (id: number) => `${BASE_URL}products/${id}`,
  searchProducts: (query: string) => `${BASE_URL}products/search?q=${encodeURIComponent(query)}`,
}