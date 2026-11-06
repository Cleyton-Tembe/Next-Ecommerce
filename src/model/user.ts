import bcrypt from "bcryptjs";
import mongoose, { HydratedDocument, Model, Types } from "mongoose";

export interface ICartItem {
  quantity: number;
  product?: Types.ObjectId;
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  cartItems: ICartItem[];
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  ComparePassword(password: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<
  IUser,
  IUserMethods & { cartItems: Types.DocumentArray<ICartItem> }
>;

export type UserModel = Model<
  IUser,
  Record<string, never>,
  IUserMethods,
  Record<string, never>,
  UserDocument
>;

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password must at least have 6 characters"],
    },

    cartItems: [
      {
        quantity: {
          type: Number,
          default: 1,
        },

        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  try {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(10);

    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.error("error hashing before committing: ", error);
    throw error;
  }
});

UserSchema.methods.ComparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

const User =
  (mongoose.models.User as UserModel | undefined) ||
  mongoose.model<IUser, UserModel>("User", UserSchema);

export default User;
