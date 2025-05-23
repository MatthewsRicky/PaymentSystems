import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const body = await req.json();
	console.log("Payment request received:", body);
	return NextResponse.json({ message: "OK" });
}
