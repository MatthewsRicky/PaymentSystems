import { NextResponse } from "next/server";

// Handle GET requests (Pesapal verification)
export async function GET() {
	return NextResponse.json({ message: "Pesapal IPN URL Verified" });
}

// Handle POST requests (Actual IPN Notifications)
export async function POST(req: Request) {
	try {
		const pesapalSignature = req.headers.get("X-Pesapal-Signature");

		if (!pesapalSignature || pesapalSignature !== process.env.PESAPAL_SECRET_KEY) {
			return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
		}

		const body = await req.json();
		console.log("Pesapal IPN Received:", body);

		const { OrderTrackingId } = body;

		// Fetch the actual payment status from Pesapal
		const response = await fetch(`${process.env.PESAPAL_API_URL}/Transactions/GetTransactionStatus?OrderTrackingId=${OrderTrackingId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.PESAPAL_AUTH_TOKEN}`,
			},
		});

		const paymentStatus = await response.json();
		console.log("Verified Payment Status:", paymentStatus);


		return NextResponse.json({ message: "IPN Processed Successfully" });
	} catch (error) {
		console.error("Pesapal IPN Error:", error);
		return NextResponse.json({ error: "Failed to process IPN" }, { status: 500 });
	}
}
