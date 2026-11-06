import mongoose, { HydratedDocument, Model, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder {
  user: Types.ObjectId;
  products: IOrderItem[];
  totalAmount: number;
  stripeSessionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderModel = Model<IOrder>;
export type OrderDocument = HydratedDocument<IOrder>;

const OrderSchema = new mongoose.Schema<IOrder, OrderModel>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    stripeSessionId: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

const Order =
  (mongoose.models.Order as OrderModel | undefined) ||
  mongoose.model<IOrder, OrderModel>("Order", OrderSchema);

export default Order;
