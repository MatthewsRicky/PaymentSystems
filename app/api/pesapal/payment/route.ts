import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		// Get request body from frontend
		const { amount, email, phoneNumber, currency, paymentMethod } = await req.json();

		// Unique order reference ID (you can replace this with your own logic)
		const merchantReference = `ORDER-${Date.now()}`;

		// Define the Pesapal payment request payload
		const payload = {
			id: merchantReference,
			amount,
			currency: currency || "KES", // Default to Kenyan Shilling
			description: "Order Payment",
			callback_url: "https://all-poems-joke.loca.lt/payment", // Your redirect URL
			notification_id: process.env.PESAPAL_IPN_ID, // IPN Notification ID from Pesapal
			email,
			phone_number: phoneNumber,
			payment_method: paymentMethod, // e.g., "MPESA", "VISA", "PAYPAL"
		};

		// Send request to Pesapal API
		const response = await fetch(`${process.env.PESAPAL_API_URL}/Transactions/SubmitOrderRequest`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.PESAPAL_AUTH_TOKEN}`, // Your Pesapal auth token
			},
			body: JSON.stringify(payload),
		});

		// Parse response
		const data = await response.json();

		// Return the payment URL to the frontend
		return NextResponse.json({ payment_url: data.redirect_url, merchantReference });
	} catch (error) {
		console.error("Pesapal Payment Error:", error);
		return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
	}
}
