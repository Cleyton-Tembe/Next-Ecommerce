import { NextRequest, NextResponse } from "next/server";




export function GET(res: NextRequest) {
    
    return NextResponse.json("hello");
}