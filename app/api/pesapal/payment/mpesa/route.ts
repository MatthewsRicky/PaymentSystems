import { NextRequest, NextResponse } from 'next/server';

const credentials = {
	consumerKey: process.env.MPESA_CONSUMER_KEY!,
	consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
	shortcode: process.env.MPESA_SHORTCODE!,
	passkey: process.env.MPESA_PASSKEY!,
	callbackUrl: process.env.MPESA_CALLBACK_URL!,
};

async function getAccessToken() {
	const auth = Buffer.from(`${credentials.consumerKey}:${credentials.consumerSecret}`).toString('base64');
	const res = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
		headers: { Authorization: `Basic ${auth}` },
	});
	const data = await res.json();
	return data.access_token;
}

function getTimestamp() {
	const now = new Date();
	const pad = (n: number) => n.toString().padStart(2, '0');
	return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

export async function POST(req: NextRequest) {
	const { amount, reference } = await req.json();

	try {
		const accessToken = await getAccessToken();
		const timestamp = getTimestamp();
		const password = Buffer.from(`${credentials.shortcode}${credentials.passkey}${timestamp}`).toString('base64');

		const res = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				BusinessShortCode: credentials.shortcode,
				Password: password,
				Timestamp: timestamp,
				TransactionType: 'CustomerPayBillOnline',
				Amount: amount,
				PartyA: '254704580875', // REPLACE with user's phone input (MSISDN format)
				PartyB: credentials.shortcode,
				PhoneNumber: '254704580875', // same here
				CallBackURL: credentials.callbackUrl,
				AccountReference: reference,
				TransactionDesc: 'Next.js Daraja Test',
			}),
		});

		const data = await res.json();
		return NextResponse.json(data);
	} catch (err) {
		console.error('M-Pesa Error:', err);
		return NextResponse.json({ error: 'M-Pesa request failed' }, { status: 500 });
	}
}
