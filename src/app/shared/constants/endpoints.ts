
export const apiEndpoints = {
    allProducts:(skip:number,limit:number)=> `products?limit=${limit}&skip=${skip}`,
    getProductById: (id: number) => `products/${id}`,
    searchProducts: (query: string) => `products/search?q=${query}`,

}

