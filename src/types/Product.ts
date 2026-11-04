export type ProductCategory =
  | "jeans"
  | "shoes"
  | "glasses"
  | "jackets"
  | "suits"
  | "bags"
  | (string & {});

export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  isFeatured: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductInput = Pick<
  Product,
  "name" | "description" | "category"
> & {
  price: number | string;
  image: string;
  isFeatured?: boolean;
};

export type CartItem = Product & {
  quantity: number;
};

export type Coupon = {
  code: string;
  discountPercentage: number;
  _id?: string;
  expirationDate?: string;
  isActive?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductsResponse = { products: Product[] };
export type FeaturedProductsResponse = { fproducts: Product[] };
export type CreateProductResponse = { message: string; product: Product };
export type ToggleFeaturedResponse = { updatedProd: Product };
export type CartResponse = { cart: CartItem[] };
export type MyCouponResponse = { coupon: Coupon | null };
export type ValidateCouponResponse = {
  message: string;
  code: string;
  discountPercentage: number;
};
