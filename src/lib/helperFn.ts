import User, { UserDocument } from "@/model/user";
import { NextRequest } from "next/server";
import { connectDB } from "./db";
import { jwtVerify, JWTPayload } from "jose";

export type TokenUser = {
  id: string;
  name: string;
  role: string;
};

export type TokenPayload = JWTPayload & { user: TokenUser };

export default async function GetAuthUserHeader(
  req: NextRequest,
): Promise<UserDocument | null> {
  try {
    await connectDB();
    const userid = req.headers.get("x-user-id");

    if (!userid) return null;

    return await User.findById(userid);
  } catch (error) {
    console.error("GetAuthUserHeader: ", error);
    return null;
  }
}

export const getSecret = () =>
  new TextEncoder().encode(process.env.NEXT_SECRET_TOKEN);

export const getDecodedToken = async (
  token: string,
): Promise<TokenPayload | null> => {
  try {
    const { payload } = await jwtVerify<TokenPayload>(token, getSecret());
    return payload;
  } catch {
    // token inválido ou expirado
    return null;
  }
};

export const getUserHeaders = (req: NextRequest) => {
  const username = req.headers.get("x-user-name");
  const userrole = req.headers.get("x-user-role");
  const userid = req.headers.get("x-user-id");

  if (!username || !userrole || !userid) {
    return null;
  }

  return {
    name: username,
    role: userrole,
    userid: userid,
  };
};

export const CATEGORIES = [
  "jeans",
  "t-shirts",
  "shoes",
  "glasses",
  "jackets",
  "suits",
  "bags",
] as const;

export type CategorySlug = (typeof CATEGORIES)[number];

export function isCategory(value: string): value is CategorySlug {
  return (CATEGORIES as readonly string[]).includes(value);
}

/** "t-shirts" "T-shirts" */
export function categoryTitle(slug: string): string {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}
