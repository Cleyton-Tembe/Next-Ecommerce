import { NextRequest, NextResponse } from "next/server";
import { getDecodedToken } from "@/lib/helperFn";

export default async function middleware(req: NextRequest) {
  const PUBLIC_ROUTES = ["/api/auth/signup", "/api/auth/login", "/"];
  const PRIVATE_ROUTES = ["/admin"];

  console.log("proxy first");

  try {
    const token = req.cookies.get("jwt")?.value;
    console.log("path name: ", req.nextUrl.pathname);
    if (!token && PUBLIC_ROUTES.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    }

    if (token && PUBLIC_ROUTES.includes(req.nextUrl.pathname)) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const decoded = await getDecodedToken(token);
    console.log("decoded: ", decoded);
    if (!decoded) {
      return NextResponse.json(
        { message: "Token not authorized" },
        { status: 401 },
      );
    }

    // if (!mongoose.isValidObjectId(decoded.userid)){
    //   return NextResponse.json({ message: "token not valid" }, { status: 401 })};

    const requestHeaders = new Headers(req.headers);

    requestHeaders.set("x-user-id", decoded.user.id);
    requestHeaders.set("x-user-role", decoded.user.role);
    requestHeaders.set("x-user-name", decoded.user.name);

    if (
      PRIVATE_ROUTES.includes(req.nextUrl.pathname) &&
      decoded.user.role !== "admin"
    ) {
      return NextResponse.json(
        { message: "you're not admin so you must be redirected" },
        { status: 401 },
      );
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error("proxy: ", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}

export const config = {
  matcher: [
    "/api/auth/:path*",
    "/api/products/:path*",
    "/admin",
    "/api/payments/create-checkout-session",
  ],
};
