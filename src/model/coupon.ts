import mongoose, { HydratedDocument, Model, Types } from "mongoose";

export interface ICoupon {
  code: string;
  discountPercentage: number;
  expirationDate: Date;
  isActive: boolean;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type CouponModel = Model<ICoupon>;
export type CouponDocument = HydratedDocument<ICoupon>;

const CouponSchema = new mongoose.Schema<ICoupon, CouponModel>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

const Coupon =
  (mongoose.models.Coupon as CouponModel | undefined) ||
  mongoose.model<ICoupon, CouponModel>("Coupon", CouponSchema);

export default Coupon;
