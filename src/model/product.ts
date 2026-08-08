import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
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
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

// Se o modelo já existiu nos modelos cacheados, use-o.
// Se não, crie um novo. Isso impede que o Mongoose tente criar o mesmo modelo duas vezes.
if (!mongoose.models.Product) {
  mongoose.models.Product = Product;
}

export default Product;
