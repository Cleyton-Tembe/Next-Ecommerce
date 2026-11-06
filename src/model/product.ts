import mongoose, { HydratedDocument, Model } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductModel = Model<IProduct>;
export type ProductDocument = HydratedDocument<IProduct>;

const ProductSchema = new mongoose.Schema<IProduct, ProductModel>(
  {
    name: {
      type: String,
      required: [true, "product name required"],
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: [true, "product needs a price"],
    },

    image: {
      type: String,
      required: [true, "Image is required"],
    },

    category: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Product =
  (mongoose.models.Product as ProductModel | undefined) ||
  mongoose.model<IProduct, ProductModel>("Product", ProductSchema);

export default Product;
