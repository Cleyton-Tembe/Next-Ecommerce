import { connectDB } from "@/lib/db";
import GetAuthUserHeader from "@/lib/helperFn";
import { stripe } from "@/lib/stripe";
import Coupon from "@/model/coupon";
import Order from "@/model/order";
import { NextRequest, NextResponse } from "next/server";

export const CreateCheckoutSession = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { products, couponCode } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { message: "Invalid or empty products array" },
        { status: 400 },
      );
    }

    let totalAmount = 0;

    const lineItems = products.map((product) => {
      const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
      totalAmount += amount * product.quantity;

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    await connectDB();

    const user = await GetAuthUserHeader(req);

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (totalAmount * coupon.discountPercentage) / 100,
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${"http://localhost:3000"}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${"http://localhost:3000"}/purchase-cancel`,
      discounts: coupon
        ? [
            {
              coupon: await CreateStripeCoupon(coupon.discountPercentage),
            },
          ]
        : [],
      metadata: {
        userId: user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((p) => ({
            id: p._id,
            quantity: p.quantity,
            price: p.price,
          })),
        ),
      },
    });

    if (totalAmount >= 20000) {
      await CreateNewCoupon(user._id);
    }
    return NextResponse.json(
      { url: session.url, totalAmount: totalAmount / 100 },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { message: "Error processing checkout" },
      { status: 500 },
    );
  }
};

export async function CreateStripeCoupon(discountPercentage: number) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
}

export async function CreateNewCoupon(userId: string) {
  await Coupon.findOneAndDelete({ userId });

  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId: userId,
  });

  await newCoupon.save();

  return newCoupon;
}

export async function CheckoutSuccess(req: NextRequest) {
  try {
    console.log("here! stated!!!!");
    const body = await req.json();
    const { session_id } = body;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      if (session.metadata?.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          },
        );
      }

      if (session.metadata) {
        const products = JSON.parse(session.metadata.products);
        const order = new Order({
          user: session.metadata.userId,
          products: products.map((prod) => ({
            product: prod.id,
            quantity: prod.quantity,
            price: prod.price,
          })),
          totalAmount: session.amount_total / 100,
          stripeSessionId: session_id,
        });

        await order.save();

        return NextResponse.json(
          {
            success: true,
            message:
              "Payment successful, order created, and coupon deactivated if used.",
            orderId: order._id,
          },
          { status: 200 },
        );
      }
    }
  } catch (error) {
    console.error("CheckoutSuccess: ", error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 },
    );
  }
}
