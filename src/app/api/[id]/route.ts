import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest,{ params }: {params: Promise<{ id: string }>}) {

    const data = await params;
    console.log(data)

    return NextResponse.json({data: data})
}