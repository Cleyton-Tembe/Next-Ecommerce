import User from "@/model/user";
import { NextRequest } from "next/server";
import { connectDB } from "./db";
import { jwtVerify } from "jose";


export default async function GetAuthUserHeader(req: NextRequest) {
    try {
        await connectDB();
        const userid = req.headers.get("x-user-id");

        const dbuser = await User.findById({ _id: userid });

        return dbuser;
        
    } catch (error) {

        console.error("GetAuthUserHeader: ",error)
        return null;
    }
}

export const getSecret = () => new TextEncoder().encode(process.env.NEXT_SECRET_TOKEN)

export const getDecodedToken = async (token) => {

    const decoded = await jwtVerify(token, getSecret())

    if(!decoded) return null

    return decoded.payload

}

export const getUserHeaders = (req: NextRequest) => {

    const username = req.headers.get("x-user-name")
    const userrole = req.headers.get("x-user-role")
    const userid = req.headers.get("x-user-id")

    console.log("getUserHeaaders",req.headers)

    if(!username || !userrole || !userid) {
        return null;
    }

    return {
        name: username,
        role: userrole,
        userid: userid
    }
}