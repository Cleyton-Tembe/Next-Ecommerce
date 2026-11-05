"use server";

import { connectDB } from "@/lib/db";
import GetAuthUserHeader, { getUserHeaders } from "@/lib/helperFn";
import { DeleteWeToken, generateWebToken } from "@/lib/token";
import User from "@/model/user";
import { NextRequest, NextResponse } from "next/server";

export async function SignUp(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password } = body;
    console.log("body recieved: ", body);

    if (!name || !email || !password)
      return NextResponse.json(
        { message: "Every field must be filled" },
        { status: 400 },
      );

    const dbuser = await User.findOne({ email: email });

    if (dbuser)
      return NextResponse.json(
        { message: "email already exists" },
        { status: 400 },
      );

    const user = await User.create({
      email: email,
      name: name,
      password: password,
    });

    const response = generateWebToken({
      name: user.name,
      id: user._id.toString(),
      role: user.role,
    });

    if (!response)
      return NextResponse.json(
        { message: "couldn't create token" },
        { status: 501 },
      );

    return response;
  } catch (error) {
    console.error("SignUp: ", error);

    return NextResponse.json(
      { message: "ERROR from the server" },
      { status: 500 },
    );
  }
}

export async function Login(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password)
      return NextResponse.json(
        { message: "All field must be filled" },
        { status: 400 },
      );

    const dbuser = await User.findOne({ email: email });

    if (!dbuser) {
      return NextResponse.json(
        { message: "you're not signed in" },
        { status: 404 },
      );
    }

    const isPwdCorrect = dbuser.ComparePassword(password);

    if (!isPwdCorrect)
      return NextResponse.json(
        { message: "password incorrect" },
        { status: 400 },
      );

    const response = generateWebToken({
      name: dbuser.name,
      id: dbuser._id.toString(),
      role: dbuser.role,
    });

    if (!response)
      return NextResponse.json(
        { message: "couldn't recreate token" },
        { status: 500 },
      );

    return response;
  } catch (error) {
    console.error("error Login: ", error);
    NextResponse.json({ message: "something went wrong" }, { status: 500 });
  }
}

export async function Logout() {
  try {
    const response = DeleteWeToken();

    if (!response)
      NextResponse.json({ message: "failed to logout!" }, { status: 500 });

    return response;
  } catch (error) {
    console.error("Logout: ", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function GetUser(req: NextRequest) {
  try {
    const user = getUserHeaders(req);

    if (!user) {
      return NextResponse.json({ message: "not auth" }, { status: 402 });
    }
    console.log("user sending from GetUser: ", user);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("GetUser", error);
    return NextResponse.json(
      { message: "something went wrong" },
      { status: 500 },
    );
  }
}

export async function GetProfile(req: NextRequest) {
  try {
    const user = await GetAuthUserHeader(req);

    NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("GetProfile: #%d", error);
    NextResponse.json({ message: "Something Went Wrong" }, { status: 500 });
  }
}
