import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const body = await req.json();

	console.log("✅ M-Pesa IPN Received:", JSON.stringify(body, null, 2));

	const callback = body?.Body?.stkCallback;
	const resultCode = callback?.ResultCode;
	const transactionData = callback?.CallbackMetadata?.Item || [];

	const data = transactionData.reduce((acc: Record<string, any>, item: any) => {
		acc[item.Name] = item.Value;
		return acc;
	}, {});

	const log = {
		success: resultCode === 0,
		message: callback?.ResultDesc,
		reference: callback?.CheckoutRequestID,
		amount: data.Amount,
		receipt: data.MpesaReceiptNumber,
		phone: data.PhoneNumber,
	};

	console.log("📄 Parsed M-Pesa Transaction:", log);

	// TODO: Store `log` in DB or queue here

	return NextResponse.json({ ResultCode: 0, ResultDesc: "Accepted" });
}
