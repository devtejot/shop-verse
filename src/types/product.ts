export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  tags?: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: "price-asc" | "price-desc" | "rating" | "name" | "discount";
  search?: string;
}

export interface Spec {
  label: string;
  value: string;
  unit?: string;
}

export interface ProductSpecs {
  [productId: number]: Spec[];
}

export interface PricePoint {
  date: string;
  price: number;
}
