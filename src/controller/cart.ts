import { connectDB } from "@/lib/db";
import GetAuthUserHeader from "@/lib/helperFn";
import Product from "@/model/product";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const unauthorized = () =>
  NextResponse.json({ message: "user not found" }, { status: 401 });

export async function AddToCart(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { id } = body as { id?: string };

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { message: "invalid product id" },
        { status: 400 },
      );
    }

    const user = await GetAuthUserHeader(req);
    if (!user) return unauthorized();

    const currentItem = user.cartItems.find(
      (item) => item._id.toString() === id,
    );

    if (currentItem) {
      currentItem.quantity++;
    } else {
      user.cartItems.push({
        _id: new mongoose.Types.ObjectId(id),
        quantity: 1,
      });
    }

    await user.save();
    return NextResponse.json({ userCart: user.cartItems });
  } catch (error) {
    console.error("AddToCart: ", error);
    return NextResponse.json(
      { message: "somthing went wrong" },
      { status: 500 },
    );
  }
}

export async function RemoveFromCart(req: NextRequest) {
  try {
    await connectDB();

    const dbuser = await GetAuthUserHeader(req);
    if (!dbuser) return unauthorized();

    const body = await req.json();
    const { id } = body as { id?: string };

    if (!id) {
      dbuser.set("cartItems", []);
    } else {
      dbuser.cartItems.pull({ _id: id });
    }

    await dbuser.save();

    return NextResponse.json({ cart: dbuser.cartItems }, { status: 200 });
  } catch (error) {
    console.error("RemoveAllFromCart: ", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function UpdateQuantity(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id: prodId } = await params;

    const dbuser = await GetAuthUserHeader(req);
    if (!dbuser) return unauthorized();

    const body = await req.json();
    const { quantity } = body as { quantity?: number };

    const currentItem = dbuser.cartItems.find(
      (item) => item._id.toString() === prodId,
    );

    if (!currentItem || quantity === undefined) {
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 },
      );
    }

    if (quantity === 0) {
      dbuser.cartItems.pull({ _id: prodId });
    } else {
      currentItem.quantity = quantity;
    }

    await dbuser.save();
    return NextResponse.json({ cart: dbuser.cartItems });
  } catch (error) {
    console.error("UpdateQuantity: ", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function GetProducts(req: NextRequest) {
  try {
    await connectDB();
    const user = await GetAuthUserHeader(req);
    if (!user) return unauthorized();

    const ids = user.cartItems.map((item) => item._id);
    const products = await Product.find({ _id: { $in: ids } });

    // add quantity for each product
    const cartItems = products.map((product) => {
      const item = user.cartItems.find(
        (cartItem) => cartItem._id.toString() === product._id.toString(),
      );
      return { ...product.toJSON(), quantity: item?.quantity ?? 1 };
    });

    return NextResponse.json({ cart: cartItems }, { status: 200 });
  } catch (error) {
    console.log("Error in getCartProducts controller", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
