// app/api/pesapal/initiate/route.ts
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const { firstName, lastName, email, amount, phoneNumber, description } = await req.json();

	try {
		// Get token
		const tokenResponse = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/pesapal/token`);
		const token = tokenResponse.data.token;

		const payload = {
			id: crypto.randomUUID(),
			currency: 'KES',
			amount,
			description,
			callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/pesapal/ipn`,
			cancellation_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
			notification_id: 'YOUR_NOTIFICATION_ID_FROM_PESAPAL',
			billing_address: {
				email_address: email,
				phone_number: phoneNumber,
				first_name: firstName,
				last_name: lastName,
			},
		};

		const { data } = await axios.post(
			`${process.env.PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
			payload,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
			}
		);

		return NextResponse.json(data);
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
