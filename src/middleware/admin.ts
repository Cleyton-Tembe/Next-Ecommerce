import { NextRequest } from "next/server";

export function CheckAdmin(req: NextRequest): boolean {
  const role = req.headers.get("x-user-role");

  if (!role) {
    console.error(req.headers);
    console.error("damm no role");
    return false;
  }

  return role === "admin";
}
