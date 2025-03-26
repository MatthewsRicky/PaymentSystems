import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		// Verify the request is coming from Pesapal (Security Check)
		const pesapalSignature = req.headers.get("X-Pesapal-Signature");

		if (!pesapalSignature || pesapalSignature !== process.env.PESAPAL_SECRET_KEY) {
			return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
		}

		// Parse incoming IPN request
		const body = await req.json();
		console.log("Pesapal IPN Received:", body);

		const { OrderTrackingId } = body;

		// Verify the payment status with Pesapal
		const response = await fetch(`${process.env.PESAPAL_API_URL}/Transactions/GetTransactionStatus?OrderTrackingId=${OrderTrackingId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.PESAPAL_AUTH_TOKEN}`,
			},
		});

		const paymentStatus = await response.json();

		// Log the verified payment status
		console.log("Verified Payment Status:", paymentStatus);

		// TODO: Update your database with the payment status
		// Example: updateOrderStatus(MerchantReference, paymentStatus.status);

		return NextResponse.json({ message: "IPN Processed Successfully" });
	} catch (error) {
		console.error("Pesapal IPN Error:", error);
		return NextResponse.json({ error: "Failed to process IPN" }, { status: 500 });
	}
}
