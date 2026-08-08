import { connectDB } from "@/lib/db";
import GetAuthUserHeader from "@/lib/helperFn";
import Coupon from "@/model/coupon";
import { NextRequest, NextResponse } from "next/server";

export const GetCoupon = async (req: NextRequest) => {
  try {

    await connectDB()
    const user = await GetAuthUserHeader(req);

    const coupon = await Coupon.findOne({
      userId: user._id,
      isActive: true,
    });


    return NextResponse.json({coupon: coupon || null}, {status: 200});

  } catch (error) {
    console.log("Error in getCoupon controller", error);
    return NextResponse.json({ message: "Server error"}, {status: 500});
  }
};

export const ValidateCoupon = async (req:NextRequest) => {


  try {

    await connectDB()
    const body = await req.json();
    const { code } = body

    const user = await GetAuthUserHeader(req)

    const coupon = await Coupon.findOne({
      code: code,
      userId: user._id,
      isActive: true,
    });

    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, {status: 404});
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return NextResponse.json({ message: "Coupon expired" }, {status: 404});
    }

    return NextResponse.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });

  } catch (error) {
    console.log("Error in validateCoupon controller", error);
    return NextResponse.json({ message: "Server error" }, {status: 500});
  }
};