import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const body = await req.text();  //important to use req.text()
		const data = Object.fromEntries(new URLSearchParams(body).entries());
		console.log('Pesapal IPN received:', data);

		// Extract relevant information from the IPN payload
		const transactionTrackingId = data.tracking_id;
		const paymentStatus = data.payment_status;
		const paymentMethod = data.payment_method;
		const merchantReference = data.merchant_reference; // Your notification_id

		// **Important:**
		// 1. Verify the authenticity of the IPN (refer to Pesapal documentation on IPN security).
		// 2. Update your database with the transaction status based on the received information.
		// 3. Respond to Pesapal with a "RECEIVED" status to acknowledge the IPN.

		// Example response:
		return new NextResponse('RECEIVED', { status: 200 });
	} catch (error) {
		console.error('Error handling Pesapal IPN:', error);
		return new NextResponse('Error processing IPN', {status: 500});
	}}