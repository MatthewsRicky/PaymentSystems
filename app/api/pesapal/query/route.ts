import { NextResponse } from 'next/server';
import axios from 'axios';
import { createHmac } from 'crypto';

interface QueryResponse {
	status: string;
	[key: string]: any; // Allow other properties
}

export async function GET(req: Request): Promise<NextResponse> {
	const { searchParams } = new URL(req.url);
	const trackingId = searchParams.get('trackingId');

	if (!trackingId) {
		return NextResponse.json({ error: 'Tracking ID is required.' }, { status: 400 });
	}

	try {
		const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
		const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

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
			transaction_tracking_id: trackingId,
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

		const queryParams = new URLSearchParams({
			oauth_consumer_key: consumerKey,
			oauth_timestamp: timestamp.toString(),
			oauth_nonce: nonce,
			oauth_signature_method: signatureMethod,
			oauth_version: version,
			oauth_signature: oauthSignature,
			transaction_tracking_id: trackingId,
		});

		const pesapalResponse = await axios.get<QueryResponse>(
			`https://www.pesapal.com/api/querypaymentstatusbyid?${queryParams.toString()}` // Use the correct query endpoint
		);

		return NextResponse.json(pesapalResponse.data, { status: 200 });
	} catch (error: any) {
		console.error('Error querying Pesapal transaction:', error);
		return NextResponse.json({ error: 'Failed to query Pesapal transaction.' }, { status: 500 });
	}
}