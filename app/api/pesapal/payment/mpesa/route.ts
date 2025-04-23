export async function POST(req: Request) {
	const { amount, reference } = await req.json();
	console.log("Initiating M-Pesa payment:", amount, reference);

	// Integrate with PesaPal/Daraja here

	return Response.json({ message: 'M-Pesa initiated' });
}
