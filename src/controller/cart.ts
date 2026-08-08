import { connectDB } from "@/lib/db";
import GetAuthUserHeader from "@/lib/helperFn";
import Product from "@/model/product";
import User from "@/model/user";
import { NextRequest, NextResponse } from "next/server";

export async function AddToCart(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { id } = body;
    const userid = req.headers.get("x-user-id");
    const user = await User.findById({ _id: userid });

    const currentItem = user.cartItems.find((item) => item.id === id);

    if (currentItem) {
      currentItem.quantity++;
    } else {
      user.cartItems.push(id);
    }

    await user.save();
    console.log("user cart: ", user.cartItems);
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
    const userid = req.headers.get("x-user-id");

    const dbuser = await User.findById({ _id: userid });

    const body = await req.json();
    console.log("body: ", body);
    const { id } = body;

    if (!id) {
      dbuser.cartItems = [];
    } else {
      dbuser.cartItems = dbuser.cartItems.filter(
        (item) => item._id.toString() !== id,
      );
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
    const userid = req.headers.get("x-user-id");

    const dbuser = await User.findById({ _id: userid });

    const body = await req.json();
    const { quantity } = body;
    const currentItem = dbuser.cartItems.filter(
      (item) => item._id.toString() === prodId,
    )[0];

    if (currentItem && quantity) {
      if (quantity === 0) {
        dbuser.cartItems = dbuser.cartItems.filter(
          (item) => item._id.toString() !== prodId,
        );
        await dbuser.save();
        return NextResponse.json({ cart: dbuser.cartItems });
      }

      console.log("user quantity: ", quantity);

      currentItem.quantity = quantity;
      console.log("current item: ", currentItem);
      dbuser.cartItems = dbuser.cartItems.map((item) =>
        item._id === currentItem._id ? { ...currentItem } : item,
      );
      await dbuser.save();
      console.log("dbuser cart: ", dbuser.cartItems);
      return NextResponse.json({ cart: dbuser.cartItems });
    } else {
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 },
      );
    }
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

    const products = await Product.find({ _id: { $in: user.cartItems } });

    // add quantity for each product
    const cartItems = products.map((product) => {
      const item = user.cartItems.find(
        (cartItem) => cartItem.id === product.id,
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });

    return NextResponse.json({ cart: cartItems }, { status: 200 });
  } catch (error) {
    console.log("Error in getCartProducts controller", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
