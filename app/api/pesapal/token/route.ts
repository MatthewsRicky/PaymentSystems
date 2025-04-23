// app/api/pesapal/token/route.ts
import axios from 'axios';
import { NextResponse } from 'next/server';

export async function GET() {
	const url = `${process.env.PESAPAL_BASE_URL}/api/Auth/RequestToken`;
	try {
		const { data } = await axios.post(
			url,
			{},
			{
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					'Authorization': `Basic ${Buffer.from(`${process.env.PESAPAL_CONSUMER_KEY}:${process.env.PESAPAL_CONSUMER_SECRET}`).toString('base64')}`
				}
			}
		);

		return NextResponse.json(data);
	} catch (error: any) {
		console.error(error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
