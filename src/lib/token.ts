import { jwtVerify, SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { getSecret } from "./helperFn";

type CookieUser = {
  name: string;
  role: string;
  id: string;
};

export const generateWebToken = async (user: CookieUser) => {
  if (!user) return;

  try {
    const token = await new SignJWT({ user: user })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .setIssuedAt()
      .sign(getSecret());

    const response = NextResponse.json({ message: "passed", user: user });

    response.cookies.set("jwt", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: false,
    });

    return response;
  } catch (error) {
    console.error("generateWebToken: ", error);
  }
};

export const DeleteWeToken = () => {
  try {
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 },
    );

    response.cookies.delete("jwt");

    return response;
  } catch (error) {
    console.error("DeleteWebToken: ", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
};
