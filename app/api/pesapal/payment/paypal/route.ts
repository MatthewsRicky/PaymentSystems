export async function POST(req: Request) {
	const { amount, reference } = await req.json();
	console.log("Initiating PayPal payment:", amount, reference);

	// Step 1: Create PayPal payment
	// Step 2: Return approval URL

	return Response.json({ redirectUrl: 'https://paypal.com/checkout-session' });
}
