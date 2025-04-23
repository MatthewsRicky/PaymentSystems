import { NextResponse } from 'next/server';
import axios from 'axios';
import { createHmac } from 'crypto';

interface InitializeResponse {
	status: string;
	redirect_url?: string;
	error?: string;
}

export async function POST(req: Request): Promise<NextResponse> {
	try {
		const { amount, currency, description, callback_url, notification_id } = await req.json();

		const consumerKey = process.env.PESAPAL_CONSUMER_KEY; // Store in environment variables
		const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET; // Store in environment variables

		if (!consumerKey || !consumerSecret) {
			return NextResponse.json({ error: 'Pesapal API keys not configured.' }, { status: 500 });
		}

		const timestamp = Math.floor(Date.now() / 1000);
		const nonce = Math.random().toString(36).substring(2, 15);

		const signatureMethod = 'HMAC-SHA1';
		const version = '1.0';

		const baseStringParams = {
			oauth_consumer_key: consumerKey,
			oauth_nonce: nonce,
			oauth_signature_method: signatureMethod,
			oauth_timestamp: timestamp,
			oauth_version: version,
			amount,
			currency,
			description,
			callback_url,
			notification_id,
		};

		const baseString = Object.keys(baseStringParams)
			.sort()
			.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(baseStringParams[key])}`)
			.join('&');

		const signatureKey = `${encodeURIComponent(consumerSecret)}&`;

		const signature = createHmac('sha1', signatureKey)
			.update(baseString)
			.digest('base64');

		const oauthSignature = encodeURIComponent(signature);

		const postData = {
			amount,
			currency,
			description,
			callback_url,
			notification_id,
			oauth_consumer_key: consumerKey,
			oauth_timestamp: timestamp,
			oauth_nonce: nonce,
			oauth_signature_method: signatureMethod,
			oauth_version: version,
			oauth_signature: oauthSignature,
		};

		const pesapalResponse = await axios.post<InitializeResponse>(
			'https://www.pesapal.com/api/PostPesapalDirectOrderV3', // Use the correct Pesapal API endpoint
			postData,
			{
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				transformRequest: (data) => {
					return Object.keys(data)
						.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
						.join('&');
				},
			}
		);

		const { status, redirect_url, error } = pesapalResponse.data;

		if (status === 'OK' && redirect_url) {
			return NextResponse.json({ redirectUrl: redirect_url }, { status: 200 });
		} else {
			console.error('Pesapal Error:', pesapalResponse.data);
			return NextResponse.json({ error: error || 'Failed to initialize Pesapal transaction.' }, { status: 400 });
		}
	} catch (error: any) {
		console.error('Error initializing Pesapal:', error);
		return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
	}
}