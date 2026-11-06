import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/db";
import redis from "@/lib/redis-db";
import { CheckAdmin } from "@/middleware/admin";
import Product from "@/model/product";
import mongoose from "mongoose";
import { Product as ProductType } from "@/types/Product";
import { NextRequest, NextResponse } from "next/server";

export async function GetEveryProduct() {
  try {
    await connectDB();

    const products = await Product.find({});

    if (!products) {
      return NextResponse.json(
        { message: "no products found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ products: products });
  } catch (error) {
    console.error("GetEveryProduct: ", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function GetFeaturedProducts() {
  try {
    await connectDB();

    let featuredProd: unknown = await redis.get("featured_products");

    console.log("featured product: ", featuredProd);
    if (featuredProd) return NextResponse.json({ fproducts: featuredProd });

    featuredProd = await Product.find({ isFeatured: true }).lean();

    if (!featuredProd) {
      return NextResponse.json(
        { message: "prouducts not found" },
        { status: 404 },
      );
    }

    await redis.set("featured_products", featuredProd);

    return NextResponse.json({ fproducts: featuredProd });
  } catch (error) {
    console.error("GetFeaturedProducts: ", error);
    return NextResponse.json({ message: "something went wrong!" });
  }
}

export async function CreateProduct(req: NextRequest) {
  if (!CheckAdmin(req)) {
    return NextResponse.json(
      { message: "user not authorized" },
      { status: 401 },
    );
  }

  try {
    console.log("creating");
    await connectDB();

    const body = await req.json();

    const { name, price, description, image, category } = body;

    if (!name || !price || !description || !category || !image) {
      return NextResponse.json(
        { message: "fill every field" },
        { status: 400 },
      );
    }

    const cloudresponse = await cloudinary.uploader.upload(image, {
      folder: "products",
    });

    const product = await Product.create({
      name,
      description,
      image: cloudresponse?.secure_url ? cloudresponse.secure_url : "",
      price,
      category,
    });

    return NextResponse.json(
      { message: "success", product: product },
      { status: 201 },
    );
  } catch (error) {
    console.error("CreateProduct: ", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function DeleteProduct(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!CheckAdmin(req))
    return NextResponse.json(
      { message: "user not authorized" },
      { status: 401 },
    );

  try {
    await connectDB();
    const { id } = await params;

    if (!id || !mongoose.isValidObjectId(id))
      return NextResponse.json(
        { message: "product does not exist" },
        { status: 400 },
      );

    const product = await Product.findById(id);

    if (!product)
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 },
      );

    if (product.image) {
      const pubid = product.image.split("/").pop()?.split(".")[0];

      try {
        await cloudinary.uploader.destroy(`products/${pubid}`);
        console.log("deleted image from cloudinary");
      } catch (error) {
        console.error("if image: ", error);
        return NextResponse.json(
          { message: "something went wrong" },
          { status: 500 },
        );
      }
    }

    await Product.findByIdAndDelete(id);
    await UpdateFeatureProdCache();

    return NextResponse.json(
      { message: "deleted with success!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DeleteProduct", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function GetRecommendedProd() {
  try {
    await connectDB();

    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    if (!products)
      return NextResponse.json(
        { message: "no products found" },
        { status: 404 },
      );

    return NextResponse.json({ products: products }, { status: 200 });
  } catch (error) {
    console.error("GetRecommendedProd: ", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function GetProdByCategory(
  category: string,
): Promise<ProductType[]> {
  await connectDB();

  const products = await Product.find({ category })
    .sort({ createdAt: -1 })
    .lean();

  return products.map((p) => ({
    _id: String(p._id),
    name: p.name,
    description: p.description,
    price: p.price,
    image: p.image,
    category: p.category,
    isFeatured: Boolean(p.isFeatured),
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : undefined,
    updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString() : undefined,
  }));
}
export async function ToggleFeaturedProd(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!CheckAdmin(req))
    return NextResponse.json(
      { message: "user not authorized" },
      { status: 401 },
    );

  try {
    await connectDB();

    const { id } = await params;
    console.log("hello id: ", id);
    if (!mongoose.isValidObjectId(id))
      return NextResponse.json(
        { message: "product not found" },
        { status: 400 },
      );

    const product = await Product.findById(id);

    if (!product)
      return NextResponse.json(
        { message: "product not found" },
        { status: 404 },
      );

    product.isFeatured = !product.isFeatured;
    const updatedProd = await product.save();
    await UpdateFeatureProdCache();
    return NextResponse.json({ updatedProd: updatedProd }, { status: 200 });
  } catch (error) {
    console.error("ToggleFeaturedProd", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function UpdateFeatureProdCache() {
  try {
    await connectDB();

    const featuredProd = await Product.find({ isFeatured: true }).lean();
    await redis.set("featured_products", featuredProd);

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error("UpdateFeatureProdCache", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}
