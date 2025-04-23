export async function POST(req: Request) {
	const { amount, reference } = await req.json();
	console.log("Initiating Visa payment:", amount, reference);

	// Redirect to Visa gateway or PesaPal Visa interface
	return Response.json({ redirectUrl: 'https://payment-processor.com/visa-session' });
}
