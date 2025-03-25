import { NextResponse } from "next/server";

export async function GET(req: Request ) {
	const PESAPAL_URL = `${process.env.PESAPAL_URL}/Transactions/GetTransaction/Status`;
	const { searchParams } = new URL(req.url);
	const transactionId = searchParams.get("transactionId");

	if (!transactionId) return NextResponse.json({error: "Missing transaction ID"}, {status: 400});

	try{
		const response = await fetch(`${PESAPAL_URL}/${transactionId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.PESAPAL_URL}`,
			},
		});

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, {status: 400});
	}
}