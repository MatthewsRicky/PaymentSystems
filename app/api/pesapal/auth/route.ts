import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const PESAPAL_URL = 'https://cybqa.pesapal.com/pesapalv3/Transactions/SubmitOrderRequest';
	const { amount, currency, email, phoneNumber, description, paymentMethod } = await req.json();

	// Get Auth Token First (Use your existing token fetching logic)
	const authResponse = await fetch(`${process.env.PESAPAL_API_URL}/Auth/RequestToken`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			consumer_key: process.env.PESAPAL_CONSUMER_KEY,
			consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
		}),
	});

	const authData = await authResponse.json();
	if (!authResponse.ok) return NextResponse.json({ error: "Auth failed" }, { status: 500 });

	const token = authData.token;

	// Payment payload
	const payload = {
		id: Math.floor(Math.random() * 100000).toString(), // Unique order ID
		currency,
		amount,
		description,
		callback_url: "https://all-poems-joke.loca.lt/payment",
		notification_id: "YOUR_IPN_ID", // Set up an Instant Payment Notification (IPN)
		email,
		phone_number: phoneNumber,
		payment_method: paymentMethod, // Visa, M-Pesa, PayPal (Pesapal handles selection)
	};

	console.log(payload);

	try {
		const response = await fetch(PESAPAL_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(payload),
		});

		const data = await response.json();
		if (!response.ok) {
			Error(data.error || "Payment failed")
		}

		return NextResponse.json({ redirect_url: data.redirect_url });
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
